'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MobileAppEntry() {
    const router = useRouter();

    useEffect(() => {
        // Only run redirect logic on mobile devices
        if (window.innerWidth < 1024) {
            const timer = setTimeout(() => {
                router.push('/login');
            }, 2500); // 2.5 seconds splash time
            return () => clearTimeout(timer);
        }
    }, [router]);

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center lg:hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
            >
                <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-blue-500/30 shadow-2xl">
                    <span className="text-4xl">🎓</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tuition Manager</h1>
                <p className="text-slate-500 font-medium mt-2">Smart Management</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12"
            >
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </motion.div>
        </div>
    );
}
