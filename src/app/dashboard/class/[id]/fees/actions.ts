
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function recordPayment(classId: string, studentId: string, month: string, amount: number) {
    const supabase = createClient()

    // Check if already paid
    const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('class_id', classId)
        .eq('student_id', studentId)
        .eq('month', month)
        .single()

    if (existing) {
        return { error: "Payment already recorded for this month." }
    }

    const { error } = await supabase
        .from('payments')
        .insert({
            class_id: classId,
            student_id: studentId,
            month: month,
            amount: amount,
            paid_at: new Date().toISOString()
        })

    if (error) {
        console.error('Error recording payment:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/fees`)
    return { success: true }
}

export async function removePayment(paymentId: string, classId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/fees`)
    return { success: true }
}
