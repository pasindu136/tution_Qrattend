
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAttendance(classId: string, date: string, records: { student_id: string, status: string }[]) {
    const supabase = createClient()

    // Prepare data for upsert
    const upsertData = records.map(r => ({
        class_id: classId,
        student_id: r.student_id,
        date: date,
        status: r.status
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
