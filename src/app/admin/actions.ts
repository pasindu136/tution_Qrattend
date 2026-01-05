
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string) {
    const supabase = createClient()

    // Set 30 days from NOW upon approval
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);

    await supabase
        .from('profiles')
        .update({
            is_approved: true,
            next_billing_date: nextBilling.toISOString()
        })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function deleteUser(userId: string) {
    const supabase = createClient()

    await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function toggleUnlimited(userId: string, isUnlimited: boolean) {
    const supabase = createClient()

    await supabase
        .from('profiles')
        .update({ is_unlimited: isUnlimited })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function adjustSubscriptionDays(userId: string, days: number) {
    const supabase = createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('next_billing_date')
        .eq('id', userId)
        .single()

    if (!profile) return;

    const currentExpiry = profile.next_billing_date ? new Date(profile.next_billing_date) : new Date();
    const now = new Date(); // Use current time as floor if expired? 
    // User logic: "thava thiyena dawas gana venas karanna... aduwewi gihin iwara unata passe..."
    // If expired, assume we are adding to NOW. If active, add to Expiry.
    // If subtracting, we subtract from Expiry (even if it makes it past?) - Yes.

    let baseDate = profile.next_billing_date ? new Date(profile.next_billing_date) : new Date();

    // If adding positive days and currently expired, start from NOW?
    if (days > 0 && baseDate < now) {
        baseDate = now;
    }

    baseDate.setDate(baseDate.getDate() + days);

    await supabase
        .from('profiles')
        .update({ next_billing_date: baseDate.toISOString() })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function updateSubscriptionDate(userId: string, date: string) {
    const supabase = createClient()

    await supabase
        .from('profiles')
        .update({ next_billing_date: date })
        .eq('id', userId)

    revalidatePath('/admin')
}

export async function sendNotification(userIds: string[], message: string) {
    const supabase = createClient()

    // Validate Admin
    // (Ideally middleware/RLS handles this but safe to double check or trust RLS policy 'Admins can insert')

    if (!userIds.length || !message.trim()) return;

    const notifications = userIds.map(userId => ({
        user_id: userId,
        message: message.trim()
    }));

    const { error } = await supabase
        .from('notifications')
        .insert(notifications);

    if (error) {
        console.error("Error sending notifications:", error);
        throw new Error("Failed to send notifications");
    }
}

export async function markNotificationAsRead(notificationId: string) {
    const supabase = createClient()

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '') // Security: ensure own

    revalidatePath('/dashboard')
}
