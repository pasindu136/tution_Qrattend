
'use client'

import { login } from './actions'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail, Lock, LogIn } from 'lucide-react'


export default function LoginPage({ searchParams }: { searchParams: { error?: string, message?: string } }) {
    const [isLoading, setIsLoading] = useState(false)
    const error = searchParams.error
    const message = searchParams.message

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await login(formData)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">

            {/* Background with Framer Motion */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 -z-10 h-full w-full bg-slate-50"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
                <div className="absolute right-10 bottom-10 -z-10 h-[250px] w-[250px] rounded-full bg-purple-400 opacity-20 blur-[80px]"></div>
            </motion.div>

            {/* Back Link */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-8 left-8"
            >
                <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-200">
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 m-4 relative"
            >

                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 text-3xl shadow-lg shadow-blue-500/30 mb-6 text-white"
                    >
                        👋
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-medium mt-3">Enter your credentials to access the portal</p>
                </div>

                {/* Messages */}
                {message && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-semibold flex items-center gap-2"
                    >
                        ✅ {decodeURIComponent(message)}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-2"
                    >
                        ⚠️ {decodeURIComponent(error)}
                    </motion.div>
                )}

                {/* Form */}
                <form action={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="tutor@example.com"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <LogIn size={20} />
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        Create Class
                    </Link>
                </p>

            </motion.div>
        </div>
    );
}
