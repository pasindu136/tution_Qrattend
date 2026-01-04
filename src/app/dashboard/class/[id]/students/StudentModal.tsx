
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addStudent, updateStudent } from './actions'
import { Loader2, Plus, X, Save, User } from 'lucide-react'

export default function StudentModal({
    classId,
    student = null,
    isOpen,
    onClose
}: {
    classId: string,
    student?: any,
    isOpen: boolean,
    onClose: () => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check screen size for responsive animation
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkMobile = () => setIsMobile(window.innerWidth < 1024)
            checkMobile()
            const handleResize = () => setIsMobile(window.innerWidth < 1024)
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }
    }, [])

    async function handleSubmit(formData: FormData) {
        if (isLoading) return;
        setIsLoading(true)
        try {
            let result;
            if (student) {
                result = await updateStudent(classId, student.id, formData)
            } else {
                result = await addStudent(classId, formData)
            }

            if (result?.success) {
                onClose()
            } else {
                alert("Error: " + result?.error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`fixed z-[100] bg-white p-6 shadow-2xl ${isMobile
                                ? 'bottom-0 left-0 right-0 w-full rounded-t-3xl pb-12'
                                : 'inset-0 m-auto w-full max-w-md h-fit rounded-2xl'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">{student ? 'Edit Student' : 'Add New Student'}</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Student Name</label>
                                <input
                                    name="full_name"
                                    defaultValue={student?.full_name}
                                    type="text"
                                    placeholder="e.g. Kasun Perera"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition font-medium text-slate-800"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Phone Number</label>
                                    <input
                                        name="phone"
                                        defaultValue={student?.phone}
                                        type="tel"
                                        placeholder="077 123 4567"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Index / Tute ID</label>
                                    <input
                                        name="tute_id"
                                        defaultValue={student?.tute_id}
                                        type="text"
                                        placeholder="e.g. S-001"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition font-medium text-slate-800"
                                    />
                                </div>
                            </div>

                            <button disabled={isLoading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition mt-4 flex justify-center items-center gap-2">
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>{student ? <Save size={20} /> : <Plus size={20} />} {student ? 'Save Changes' : 'Add Student'}</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
