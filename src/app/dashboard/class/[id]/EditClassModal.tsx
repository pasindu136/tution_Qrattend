'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateClass, deleteClass } from './actions'
import { Loader2, Settings, X, Trash2, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

import { createClient } from '@/utils/supabase/client'

type ClassData = {
    id: string
    name: string
    subject: string
    day: string
    time: string
    fee_amount: number
    teacher_id: string
}

export default function EditClassModal({ classData }: { classData: ClassData }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const router = useRouter()

    // Check for mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    async function handleUpdate(formData: FormData) {
        // Admin Confirmation
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id !== classData.teacher_id) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are editing another user's class.\nAre you sure you want to proceed?");
            if (!confirmed) return;
        }

        setIsLoading(true)
        try {
            const result = await updateClass(classData.id, formData)
            if (result?.success) {
                setIsOpen(false)
                router.refresh()
            } else {
                alert('Failed to update class')
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function executeDelete() {
        // Admin Confirmation for Delete
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id !== classData.teacher_id) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are DELETING another user's class.\nThis action is irreversible.\nAre you absolutely sure?");
            if (!confirmed) {
                setShowDeleteConfirm(false); // Close the regular modal if they cancel the admin warning
                return;
            }
        }

        setIsDeleting(true)
        try {
            await deleteClass(classData.id)
            // Redirect happens on server
        } catch (e) {
            console.error(e)
            setIsDeleting(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition"
                title="Edit Class Settings"
            >
                <Settings size={20} />
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
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                        />

                        {/* Modal / Bottom Sheet */}
                        <motion.div
                            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
                            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`fixed z-[101] bg-white p-6 shadow-2xl ${isMobile
                                ? 'bottom-0 left-0 right-0 w-full rounded-t-3xl pb-8'
                                : 'inset-0 m-auto w-full max-w-lg h-fit rounded-2xl'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Edit Class</h2>
                                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <form action={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Class Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={classData.name}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                                        <input
                                            name="subject"
                                            type="text"
                                            defaultValue={classData.subject}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Fee (LKR)</label>
                                        <input
                                            name="fee"
                                            type="number"
                                            defaultValue={classData.fee_amount}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Day</label>
                                        <select
                                            name="day"
                                            defaultValue={classData.day}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                        >
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
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                        <input
                                            name="time"
                                            type="time"
                                            defaultValue={classData.time}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={isLoading || isDeleting}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition flex justify-center items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isLoading || isDeleting}
                                        className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition flex justify-center items-center gap-2"
                                    >
                                        {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <><Trash2 size={20} /> Delete Class</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={executeDelete}
                title="Delete Class?"
                message="Are you sure you want to delete this class? All students, attendance records, and fees associated with this class will be permanently deleted. This action cannot be undone."
                confirmText="Yes, Delete Class"
                cancelText="Keep Class"
                isDangerous={true}
            />
        </>
    )
}
