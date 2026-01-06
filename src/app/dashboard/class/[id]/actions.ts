'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateClass(classId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    // Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const day = formData.get('day') as string
    const time = formData.get('time') as string
    const fee = formData.get('fee') as string

    let query = supabase
        .from('classes')
        .update({
            name,
            subject,
            day,
            time,
            fee_amount: parseFloat(fee)
        })
        .eq('id', classId)

    // Only enforce ownership if NOT admin
    if (!isAdmin) {
        query = query.eq('teacher_id', user.id)
    }

    const { error } = await query

    if (error) {
        console.error('Error updating class:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}`)
    revalidatePath('/dashboard')

    // If Admin, revalidate their view too
    if (isAdmin) {
        revalidatePath('/admin/tutors/[id]', 'page')
    }

    return { success: true }
}

export async function deleteClass(classId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    // Fetch Class Owner & Current User Role
    const [profileResult, classResult] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', user.id).single(),
        supabase.from('classes').select('teacher_id').eq('id', classId).single()
    ])

    const isAdmin = profileResult.data?.role === 'admin'
    const teacherId = classResult.data?.teacher_id

    if (!teacherId) return { error: "Class not found" }

    let query = supabase
        .from('classes')
        .delete()
        .eq('id', classId)

    // Enforce ownership if NOT admin
    if (!isAdmin) {
        query = query.eq('teacher_id', user.id)
    }

    const { error } = await query

    if (error) {
        console.error('Error deleting class:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')

    if (isAdmin) {
        redirect(`/admin/tutors/${teacherId}`)
    } else {
        redirect('/dashboard')
    }
}
