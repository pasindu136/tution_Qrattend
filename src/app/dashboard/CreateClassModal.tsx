'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClass } from './actions'
import { Loader2, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CreateClassModal({ ownerId }: { ownerId?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()
    const { t } = useLanguage()

    // Check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    async function handleSubmit(formData: FormData) {
        if (isLoading) return; // Prevent double submission

        // Admin Confirmation Check
        if (ownerId) {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.id !== ownerId) {
                const confirmed = window.confirm(`⚠️ ${t.modals.admin_warning}:\n\n${t.modals.admin_warning_desc}`);
                if (!confirmed) return;
            }
        }

        setIsLoading(true)
        try {
            // Pass ownerId to the server action
            const result = await createClass(formData, ownerId)
            if (result?.success) {
                setIsOpen(false)
                router.refresh()
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 lg:px-6 lg:py-3 rounded-full lg:rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-transform active:scale-95"
            >
                <Plus size={24} className="lg:hidden" /> {/* Mobile Icon */}
                <span className="hidden lg:flex items-center gap-2"><Plus size={20} /> {t.modals.create_class}</span> {/* Desktop Text */}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Modal / Bottom Sheet */}
                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`fixed z-[100] bg-white p-6 shadow-2xl ${isMobile
                                ? 'bottom-0 left-0 right-0 w-full rounded-t-3xl pb-10'
                                : 'inset-0 m-auto w-full max-w-lg h-fit rounded-2xl'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">{t.modals.create_class}</h2>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <form action={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">{t.forms.class_name}</label>
                                    <input name="name" type="text" placeholder={t.forms.placeholder_name} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">{t.forms.subject}</label>
                                        <input name="subject" type="text" placeholder={t.forms.placeholder_subject} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">{t.forms.fee}</label>
                                        <div className="flex gap-2">
                                            <input name="fee" type="number" placeholder={t.forms.placeholder_fee} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition" />
                                            <select name="fee_type" className="px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition text-sm font-medium text-slate-600">
                                                <option value="monthly">Monthly</option>
                                                <option value="daily">Daily</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">{t.forms.day}</label>
                                        <select name="day" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition">
                                            <option>Monday</option>
                                            <option>Tuesday</option>
                                            <option>Wednesday</option>
                                            <option>Thursday</option>
                                            <option>Friday</option>
                                            <option>Saturday</option>
                                            <option>Sunday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">{t.forms.time}</label>
                                        <input name="time" type="time" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition" />
                                    </div>
                                </div>

                                <button disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition mt-4 flex justify-center items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> {t.modals.create}</>}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
