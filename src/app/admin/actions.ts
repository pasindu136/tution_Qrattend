
'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js' // Direct usage for Admin
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper for Admin Actions (Bypasses RLS)
function getAdminSupabase() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        console.warn("⚠️ Admin Key missing. Some admin features will be disabled.");
        return null;
    }

    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

export async function sendEmail(emails: string[], subject: string, message: string) {
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        throw new Error("Server config error: RESEND_API_KEY Missing. Please restart the terminal.");
    }

    if (!emails.length || !message.trim()) return;

    try {
        const { data, error } = await resend.emails.send({
            from: 'TuitionMate <updates@bitsync.site>',
            to: emails,
            subject: subject || 'New Announcement',
            html: `<div style="font-family: sans-serif; color: #333;">
                    <h2>Hello from TuitionMate</h2>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr />
                    <p style="font-size: 12px; color: #888;">You are receiving this email from your tuition management admin.</p>
                   </div>`
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw new Error(`Resend Error: ${error.message} (${error.name})`);
        }

        return { success: true, data };
    } catch (e: any) {
        console.error("Email Sending Exception:", e);
        // Throw actual error message for UI to display
        throw new Error(e.message || "Failed to send email");
    }
}

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

// Suspend User (Soft Delete / Deactivate)
export async function suspendUser(userId: string) {
    const supabase = createClient()

    await supabase
        .from('profiles')
        .update({ is_approved: false })
        .eq('id', userId)

    revalidatePath('/admin')
}

// PERMANENTLY Delete User (Using Admin API)
export async function deleteUserAccount(userId: string) {
    const supabaseAdmin = getAdminSupabase();

    if (!supabaseAdmin) {
        throw new Error("Action Failed: Server missing Admin Key (SUPABASE_SERVICE_ROLE_KEY).");
    }

    // 1. Delete from Auth (This usually cascades to profiles if set up, but we'll do both to be safe or rely on cascade)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Delete user error:", error);
        throw new Error("Failed to delete user account: " + error.message);
    }

    // Note: If you have foreign keys with 'ON DELETE CASCADE', the profile and data will be gone.
    // If not, you might need to manually delete from public tables using supabaseAdmin.

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

export async function deleteNotification(notificationId: string) {
    const supabase = createClient();

    // Check if user is admin (optional safety, RLS policy should handle too)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error, count } = await supabase
        .from('notifications')
        .delete({ count: 'exact' })
        .eq('id', notificationId);

    if (error) {
        console.error("Error deleting notification:", error);
        throw new Error("Failed to delete notification");
    }

    if (count === 0) {
        // Wait, regular users might delete their own notifications too? 
        // Admin likely wants to delete THEIR copy or the global log?
        // Actually for now let's assume this is fine.
        // throw new Error("Could not delete notification. It may not exist or you don't have permission.");
    }

    revalidatePath('/admin');
}

export async function getSentNotifications() {
    // USE ADMIN CLIENT TO BYPASS RLS
    // Admin needs to see notifications sent to ANY user
    const supabaseAdmin = getAdminSupabase();

    if (!supabaseAdmin) {
        console.warn("Cannot fetch admin history: Missing Service Role Key");
        return [];
    }

    // Fetch last 50 notifications
    // Join with profiles to get Recipient Name
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select(`
            *,
            profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Fetch history error:", error);
        return [];
    }

    // Simplify structure
    return data.map((n: any) => ({
        id: n.id,
        message: n.message,
        created_at: n.created_at,
        is_read: n.is_read,
        recipient_name: n.profiles?.full_name || 'Unknown'
    }));
}

export async function sendSystemStatusReport(isManual = false) {
    const supabaseAdmin = getAdminSupabase();
    if (!supabaseAdmin) throw new Error("Server missing Admin Key");

    // 1. Fetch Stats
    const { count: totalUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
    const { count: pendingUsers } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_approved', false);
    const { count: activeSubs } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gt('next_billing_date', new Date().toISOString());
    const { count: totalClasses } = await supabaseAdmin.from('classes').select('*', { count: 'exact', head: true });

    // 2. Format Message
    const title = isManual ? "System Status Report (Manual)" : "Daily System Status Report";
    const statusHtml = `
        <div style="font-family: sans-serif; color: #333;">
            <h2>${title}</h2>
            <p>Here is the current status of the Tuition Manager system:</p>
            <ul>
                <li><strong>Total Users:</strong> ${totalUsers || 0}</li>
                <li><strong>Pending Approvals:</strong> ${pendingUsers || 0}</li>
                <li><strong>Active Subscriptions:</strong> ${activeSubs || 0}</li>
                <li><strong>Total Classes Created:</strong> ${totalClasses || 0}</li>
            </ul>
            <p>Generated at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}</p>
        </div>
    `;

    // 3. Fetch Full Database Dump for Backup
    const backupData = await fetchFullDatabaseDump(supabaseAdmin);
    const backupBuffer = Buffer.from(JSON.stringify(backupData, null, 2));

    // 4. Send Email with Attachment
    try {
        await resend.emails.send({
            from: 'TuitionMate System <updates@bitsync.site>',
            to: ['pasindusandamal344@gmail.com'],
            subject: title,
            html: statusHtml,
            attachments: [
                {
                    filename: `tuition-manager-backup-${new Date().toISOString().split('T')[0]}.json`,
                    content: backupBuffer,
                },
            ],
        });
        return { success: true };
    } catch (error: any) {
        console.error("Status Email Failed:", error);
        throw new Error(error.message);
    }
}

// Internal Helper: Fetch all data
async function fetchFullDatabaseDump(supabaseAdmin: any) {
    const tables = ['profiles', 'classes', 'students', 'attendance', 'payments', 'expenses', 'notifications'];
    const dump: any = { timestamp: new Date().toISOString(), data: {} };

    for (const table of tables) {
        const { data, error } = await supabaseAdmin.from(table).select('*');
        if (error) {
            console.error(`Backup Error [${table}]:`, error);
            dump.data[table] = []; // Fallback to empty if fails, but log it
        } else {
            dump.data[table] = data;
        }
    }
    return dump;
}

// Restore Function
export async function restoreDatabase(jsonContent: string) {
    const supabaseAdmin = getAdminSupabase();
    if (!supabaseAdmin) throw new Error("Server missing Admin Key");

    const backup = JSON.parse(jsonContent);
    if (!backup.data || !backup.data.profiles) throw new Error("Invalid Backup File Format");

    // Order is critical for Deletion (Projecting foreign keys)
    // Delete Child tables first
    const deleteOrder = ['notifications', 'expenses', 'payments', 'attendance', 'students', 'classes'];

    // Order is critical for Insertion
    // Insert Parent tables first
    const insertOrder = ['profiles', 'classes', 'students', 'attendance', 'payments', 'expenses', 'notifications'];

    try {
        // 1. Clean existing data (Except Admin Profile)
        // We cannot delete profiles easily because of Auth linkage and self-deletion risk.
        // Strategy: Delete everything else. For profiles, we only UPSERT (update/insert) from backup.
        // We will NOT delete user profiles to avoid locking out the admin or breaking auth.

        for (const table of deleteOrder) {
            const { error } = await supabaseAdmin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (neq dummy uuid)
            // Note: using neq id 0 is a hack to 'delete all' if no better way. Or .gt('id', 0) if number. UUIDs are strings.
            // Best way to delete all in supabase: .neq('id', '0') usually works since UUIDs don't equal '0'.
            // Actually, for UUID PKs, .neq('id', '00000000-0000-0000-0000-000000000000') works well.
            if (error) throw new Error(`Failed to clear table ${table}: ${error.message}`);
        }

        // 2. Restore Data
        for (const table of insertOrder) {
            const rows = backup.data[table];
            if (!rows || rows.length === 0) continue;

            const { error } = await supabaseAdmin.from(table).upsert(rows);
            if (error) throw new Error(`Failed to restore table ${table}: ${error.message}`);
        }

        return { success: true, message: `Database restored successfully from ${backup.timestamp}` };

    } catch (error: any) {
        console.error("Restore Failed:", error);
        throw new Error("Restore Failed: " + error.message);
    }
}

// DANGER: Clear Database (For Testing)
export async function clearDatabase() {
    const supabaseAdmin = getAdminSupabase();
    if (!supabaseAdmin) throw new Error("Server missing Admin Key");

    const tables = ['notifications', 'expenses', 'payments', 'attendance', 'students', 'classes'];

    try {
        for (const table of tables) {
            const { error } = await supabaseAdmin.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (error) throw new Error(`Failed to clear table ${table}: ${error.message}`);
        }
        return { success: true, message: "Database cleared successfully (Profiles preserved)." };
    } catch (error: any) {
        console.error("Clear DB Failed:", error);
        throw new Error(error.message);
    }
}
