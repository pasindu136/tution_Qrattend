
'use client'

import React from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft } from 'lucide-react';

export default function PendingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4">

            {/* Background */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-yellow-400 opacity-10 blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center"
            >
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                    <Clock size={40} strokeWidth={2.5} />
                </div>

                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Approval Pending</h1>
                <p className="text-slate-500 mb-8">
                    Your account has been created successfully but is waiting for administrator approval. You will be able to access the dashboard once approved.
                </p>

                <div className="flex flex-col gap-3">
                    <form action="/auth/signout" method="post">
                        <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                            Sign Out
                        </button>
                    </form>
                    <Link href="/" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                        Back to Home
                    </Link>
                </div>

            </motion.div>
        </div>
    );
}
