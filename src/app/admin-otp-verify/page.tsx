'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldCheck, LogOut } from 'lucide-react'
import { verifyAdminOtp } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminOtpVerify() {
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (otp.length < 6) {
            setError('Please enter the 6-digit code')
            return
        }

        setIsLoading(true)
        try {
            const res = await verifyAdminOtp(otp)
            if (res.success) {
                router.push('/admin')
            } else {
                setError(res.error || 'Verification failed')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                    <ShieldCheck className="text-white" size={32} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Admin Security Check
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    We sent an OTP to the admin phone number (0767664172). Please enter it below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 overflow-hidden relative">
                    
                    <AnimatePresence mode="wait">
                        <motion.form 
                            key="otp-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6" 
                            onSubmit={handleVerifyOtp}
                        >
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">
                                    Enter 6-Digit Code
                                </label>
                                <div className="relative rounded-xl shadow-sm max-w-[220px] mx-auto">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none text-slate-900 font-bold text-center tracking-widest text-lg"
                                        placeholder="------"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all gap-2 items-center disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify & Enter'}
                            </button>
                            
                            <div className="flex flex-col items-center gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsLoading(true);
                                        const res = await import('./actions').then(m => m.resendAdminOtp());
                                        if (res.success) {
                                            alert("New OTP sent successfully!");
                                        } else {
                                            alert("Failed to send OTP: " + res.error);
                                        }
                                        setIsLoading(false);
                                    }}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                                >
                                    Resend OTP Code
                                </button>

                                <Link href="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 transition text-sm font-bold">
                                    <LogOut size={16} /> Cancel & Logout
                                </Link>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
