'use server'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyAdminOtp(inputOtp: string) {
    const cookieStore = cookies()
    const hashedOtp = cookieStore.get('admin_otp_hash')?.value
    
    if (!hashedOtp) {
        return { success: false, error: 'OTP session expired. Please login again.' }
    }
    
    const isValid = await bcrypt.compare(inputOtp, hashedOtp)
    
    if (isValid) {
        // Clear the hash cookie and set the verified cookie
        cookieStore.delete('admin_otp_hash')
        cookieStore.set('admin_otp_verified', 'true', { secure: true, httpOnly: true })
        
        return { success: true }
    } else {
        return { success: false, error: 'Invalid OTP code. Please try again.' }
    }
}
