
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClass(formData: FormData, ownerId?: string) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    let teacherId = user.id

    // If ownerId is provided and different from current user, check Admin privs
    if (ownerId && ownerId !== user.id) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'admin') {
            teacherId = ownerId
        } else {
            return { error: "Unauthorized: Only admins can create classes for others." }
        }
    }

    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const day = formData.get('day') as string
    const time = formData.get('time') as string
    const fee = formData.get('fee') as string

    const { error } = await supabase
        .from('classes')
        .insert({
            teacher_id: teacherId,
            name,
            subject,
            day,
            time,
            fee_amount: parseFloat(fee)
        })


    if (error) {
        console.error(error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
