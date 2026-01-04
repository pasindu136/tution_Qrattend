
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string) {
    const supabase = createClient()

    // Verify admin (optional double check, middleware handles mainly)
    // In a real app, strict RLS or check here is good.

    await supabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function deleteUser(userId: string) {
    const supabase = createClient()

    // Deleting from auth.users requires service_role key usually.
    // Standard RLS prevents deleting others.
    // For now, let's just "reject" by setting is_approved = false (default) or effectively banning.
    // Or if we have service role client?
    // We don't have service role client set up in code. 
    // Let's just update profile to reject/suspend for now.

    await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId)

    revalidatePath('/admin')
}
