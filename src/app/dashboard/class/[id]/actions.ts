'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateClass(classId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const day = formData.get('day') as string
    const time = formData.get('time') as string
    const fee = formData.get('fee') as string

    const { error } = await supabase
        .from('classes')
        .update({
            name,
            subject,
            day,
            time,
            fee_amount: parseFloat(fee)
        })
        .eq('id', classId)
        .eq('teacher_id', user.id) // Ensure ownership

    if (error) {
        console.error('Error updating class:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}`)
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteClass(classId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId)
        .eq('teacher_id', user.id)

    if (error) {
        console.error('Error deleting class:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    // We cannot redirect inside a try-catch block securely if we were using one, but here it's fine.
    // However, it is better to return success and let client redirect, or redirect here.
    // Server actions redirect works.
    redirect('/dashboard')
}
