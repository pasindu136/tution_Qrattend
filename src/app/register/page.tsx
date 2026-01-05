
'use client'

import { signup } from '../login/actions'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react'
import SubmitButton from '@/components/SubmitButton'


export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
    const error = searchParams.error

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans py-10">

            {/* Background with Framer Motion */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 -z-10 h-full w-full bg-slate-50"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 opacity-20 blur-[100px]"></div>
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
                className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 m-4 relative"
            >

                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-purple-600 text-2xl shadow-lg shadow-purple-500/30 mb-4 text-white"
                    >
                        🚀
                    </motion.div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your Class</h1>
                    <p className="text-slate-500 font-medium mt-2 text-sm">Start managing your students today</p>
                </div>

                {/* Error Message */}
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
                <form action={signup} className="space-y-4">

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Kasun Perera"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input
                                name="phone"
                                type="tel"
                                required
                                placeholder="077 123 4567"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="tutor@example.com"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Create a password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <SubmitButton
                        text="Create Account"
                        loadingText="Creating..."
                        className="bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                    />

                </form>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-600 hover:text-purple-700 font-bold hover:underline">
                        Log In
                    </Link>
                </p>

            </motion.div>
        </div>
    );
}
