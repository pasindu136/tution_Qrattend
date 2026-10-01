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

export async function resendAdminOtp() {
    const bcrypt = require('bcryptjs')
    const cookieStore = cookies()
    const { sendSMS } = await import('@/utils/smsapi')
    
    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedOtp = await bcrypt.hash(otp, 10)
    
    // Store in secure cookies
    cookieStore.set('admin_otp_hash', hashedOtp, { secure: true, httpOnly: true })
    cookieStore.set('admin_otp_verified', 'false', { secure: true, httpOnly: true })
    
    // Send SMS to admin number
    const result = await sendSMS('0767664172', `TuitionMate: Your Admin Login OTP is ${otp}. Please do not share this code.`)
    
    if (result.success) {
        return { success: true }
    } else {
        return { success: false, error: result.error }
    }
}
