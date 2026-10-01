'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, LogOut, Loader2 } from 'lucide-react'
import { verifyAdminOtp } from './actions'
import { signOut } from '@/app/login/actions'
import { useRouter } from 'next/navigation'

export default function AdminOtpVerify() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]
    const router = useRouter()

    useEffect(() => {
        // Auto-focus the first input on load
        inputRefs[0].current?.focus()
    }, [])

    const handleVerifyOtp = async (currentOtp: string) => {
        setIsError(false)
        setErrorMsg('')
        setIsLoading(true)
        
        try {
            const res = await verifyAdminOtp(currentOtp)
            if (res.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    router.push('/admin')
                }, 1000)
            } else {
                setIsError(true)
                setErrorMsg(res.error || 'Verification failed')
                // Clear inputs on error
                setOtp(['', '', '', '', '', ''])
                inputRefs[0].current?.focus()
            }
        } catch (err: any) {
            setIsError(true)
            setErrorMsg(err.message)
            setOtp(['', '', '', '', '', ''])
            inputRefs[0].current?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        
        // Handle paste of multiple characters
        if (value.length > 1) {
            const pastedValues = value.slice(0, 6).split('')
            for (let i = 0; i < pastedValues.length; i++) {
                if (index + i < 6) newOtp[index + i] = pastedValues[i]
            }
            setOtp(newOtp)
            
            // Focus the next empty input or the last one
            const nextIndex = Math.min(index + pastedValues.length, 5)
            inputRefs[nextIndex].current?.focus()
            
            if (newOtp.join('').length === 6) {
                handleVerifyOtp(newOtp.join(''))
            }
            return
        }

        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input automatically if a digit was entered
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus()
        }

        // Auto verify if all 6 digits are filled
        if (newOtp.join('').length === 6) {
            handleVerifyOtp(newOtp.join(''))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus()
        }
    }

    // Shake animation config
    const shakeAnimation = {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-colors duration-500 ${
                        isSuccess ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 shadow-blue-200'
                    }`}
                >
                    <ShieldCheck className="text-white" size={32} />
                </motion.div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    {isSuccess ? 'Verification Complete' : 'Two-Step Verification'}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    We sent an OTP to the admin phone number (0767664172). Please enter it below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100 relative overflow-hidden">
                    
                    {/* Success overlay pulse */}
                    {isSuccess && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-green-50/50 pointer-events-none"
                        />
                    )}

                    <motion.div 
                        animate={isError ? shakeAnimation : {}}
                        className="space-y-6 relative"
                    >
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={6} // allow paste
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    disabled={isLoading || isSuccess}
                                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none 
                                        ${isSuccess ? 'border-green-500 text-green-700 bg-green-50' : 
                                          isError ? 'border-red-500 text-red-700 bg-red-50 focus:border-red-600 focus:ring-4 focus:ring-red-100' : 
                                          'border-slate-200 text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                                        } 
                                        disabled:opacity-50`}
                                />
                            ))}
                        </div>

                        <div className="min-h-[24px]">
                            <AnimatePresence>
                                {errorMsg && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-sm font-bold text-center"
                                    >
                                        {errorMsg}
                                    </motion.p>
                                )}
                                {isLoading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center items-center gap-2 text-blue-600 text-sm font-bold"
                                    >
                                        <Loader2 size={16} className="animate-spin" />
                                        Verifying code...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex flex-col items-center gap-5 mt-6 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                disabled={isLoading || isSuccess}
                                onClick={async () => {
                                    setIsLoading(true);
                                    setIsError(false);
                                    setErrorMsg('');
                                    const res = await import('./actions').then(m => m.resendAdminOtp());
                                    if (res.success) {
                                        alert("New OTP sent successfully!");
                                    } else {
                                        setIsError(true);
                                        setErrorMsg("Failed to send OTP: " + res.error);
                                    }
                                    setIsLoading(false);
                                }}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
                            >
                                Didn't receive the code? Resend
                            </button>

                            <form action={signOut}>
                                <button 
                                    type="submit"
                                    className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 transition text-sm font-bold"
                                >
                                    <LogOut size={16} /> Cancel & Logout
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
