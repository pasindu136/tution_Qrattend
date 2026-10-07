
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: { user }, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // Check Role for Redirect
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error("Profile fetch error:", profileError)
    }

    revalidatePath('/', 'layout')

    const role = profile?.role?.toLowerCase()
    console.log(`User ${user.email} logged in with role: ${role}`)

    if (role === 'admin') {
        const { cookies } = await import('next/headers');
        
        // TEMPORARY OTP BYPASS TO SAVE SMS CREDITS
        cookies().set('admin_otp_verified', 'true', { secure: true, httpOnly: true });
        redirect('/admin')

        /*
        // ORIGINAL OTP LOGIC
        const bcrypt = await import('bcryptjs');
        const { sendSMS } = await import('@/utils/smsapi');
        
        // Generate and hash OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        
        // Store in secure cookies
        cookies().set('admin_otp_hash', hashedOtp, { secure: true, httpOnly: true });
        cookies().set('admin_otp_verified', 'false', { secure: true, httpOnly: true });
        
        // Send SMS to admin number as requested
        await sendSMS('0767664172', `TuitionMate: Your Admin Login OTP is ${otp}. Please do not share this code.`);
        
        redirect('/admin-otp-verify')
        */
    }

    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    const data = {
        email,
        password,
        options: {
            data: {
                full_name: name,
                phone: phone
            }
        }
    }

    const { data: { session }, error } = await supabase.auth.signUp(data)

    if (error) {
        return redirect(`/register?error=${encodeURIComponent(error.message)}`)
    }

    if (!session) {
        // Email verification required
        return redirect(`/login?message=Check your email to confirm account`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()

    const { cookies } = await import('next/headers')
    cookies().delete('admin_otp_hash')
    cookies().delete('admin_otp_verified')

    revalidatePath('/', 'layout')
    redirect('/login')
}
