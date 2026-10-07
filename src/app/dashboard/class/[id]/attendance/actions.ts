
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendSMS } from '@/utils/smsapi'

export async function saveAttendance(classId: string, date: string, records: { student_id: string, status: string }[]) {
    const supabase = createClient()

    // Prepare data for upsert
    const upsertData = records.map(r => ({
        class_id: classId,
        student_id: r.student_id,
        date: date,
        status: r.status,
        is_draft: false // Mark as permanent when saved
    }))

    const { error } = await supabase
        .from('attendance')
        .upsert(upsertData, {
            onConflict: 'student_id, date'
        })

    if (error) {
        console.error('Error saving attendance:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/attendance`)
    return { success: true }
}

export async function deleteAttendance(classId: string, date: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('class_id', classId)
        .eq('date', date)

    if (error) {
        console.error('Error deleting attendance:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/attendance`)
    return { success: true }
}

export async function saveDraftScan(classId: string, date: string, studentId: string, shouldSendSms: boolean = false) {
    const supabase = createClient()

    const { error } = await supabase
        .from('attendance')
        .upsert({
            class_id: classId,
            student_id: studentId,
            date: date,
            status: 'present',
            is_draft: true // Dummy mark to trigger SMS later, will be overwritten to false on full save
        }, {
            onConflict: 'student_id, date'
        })

    if (error) {
        console.error('Error saving draft scan:', error)
        return { error: error.message }
    }

    if (shouldSendSms) {
        // Fetch student details
        const { data: student } = await supabase
            .from('students')
            .select('full_name, parent_phone, phone')
            .eq('id', studentId)
            .single()

        if (student) {
            const phone = student.parent_phone || student.phone
            if (phone) {
                // Determine class name for the message
                const { data: classData } = await supabase
                    .from('classes')
                    .select('name, teacher_id')
                    .eq('id', classId)
                    .single()
                    
                const className = classData?.name || "the class"
                const message = `Dear Parent, your child ${student.full_name} has arrived at ${className} on ${date}.`
                // Await SMS to get status for developer debugging
                const smsResult = await sendSMS(phone, message).catch(err => {
                    console.error("Background SMS Error:", err);
                    return { success: false, error: err.message };
                });
                
                // Add to SMS Bill
                if (smsResult?.success && classData?.teacher_id) {
                    const month = date.substring(0, 7); // Extract YYYY-MM
                    
                    const { data: existingBill } = await supabase
                        .from('sms_bills')
                        .select('*')
                        .eq('class_id', classId)
                        .eq('month', month)
                        .single();

                    if (existingBill) {
                        await supabase.from('sms_bills').update({
                            total_messages: existingBill.total_messages + 1,
                            total_amount: (existingBill.total_messages + 1) * existingBill.cost_per_message,
                            updated_at: new Date().toISOString()
                        }).eq('id', existingBill.id);
                    } else {
                        await supabase.from('sms_bills').insert({
                            user_id: classData.teacher_id,
                            class_id: classId,
                            month: month,
                            total_messages: 1,
                            cost_per_message: 1.00,
                            total_amount: 1.00
                        });
                    }
                    
                    revalidatePath('/dashboard', 'layout');
                }
                
                return { success: true, smsResult };
            }
        }
    }

    return { success: true }
}

export async function getAttendanceSummary(classId: string) {
    const supabase = createClient()
    
    // Get all attendance records for this class
    const { data: attendance, error } = await supabase
        .from('attendance')
        .select('date, status, is_draft')
        .eq('class_id', classId)
        .order('date', { ascending: false })
        
    if (error) return { error: error.message }
    
    // Get total students count to calculate absents
    const { count: totalStudents, error: countError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', classId)
        
    // Group by date
    const summary: Record<string, { present: number, total: number }> = {}
    
    const today = new Date().toISOString().split('T')[0];
    
    if (attendance) {
        attendance.forEach(record => {
            // Skip today's date so it doesn't appear in the history until tomorrow
            // Also skip dummy/draft scans
            if (record.date === today || record.is_draft) return;
            
            if (!summary[record.date]) {
                summary[record.date] = { present: 0, total: totalStudents || 0 }
            }
            if (record.status === 'present') {
                summary[record.date].present += 1
            }
        })
    }
    
    // Convert to array, sort descending by date, and take top 30
    const summaryArray = Object.entries(summary)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 30)
    
    return { success: true, data: summaryArray }
}
