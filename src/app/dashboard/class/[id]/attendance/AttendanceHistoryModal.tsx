'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, Loader2, ArrowRight } from 'lucide-react'
import { getAttendanceSummary } from './actions'
import { useRouter } from 'next/navigation'

interface HistoryModalProps {
    classId: string
    isOpen: boolean
    onClose: () => void
}

export default function AttendanceHistoryModal({ classId, isOpen, onClose }: HistoryModalProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState<{ date: string, present: number, total: number }[]>([])

    useEffect(() => {
        if (isOpen) {
            fetchHistory()
        }
    }, [isOpen])

    async function fetchHistory() {
        setIsLoading(true)
        try {
            const result = await getAttendanceSummary(classId)
            if (result.success && result.data) {
                setHistory(result.data)
            }
        } finally {
            setIsLoading(false)
        }
    }

    function viewDate(dateStr: string) {
        onClose();
        router.push(`?date=${dateStr}`);
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 m-auto w-[calc(100%-2rem)] sm:w-full max-w-md h-fit max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <CalendarDays className="text-blue-600" />
                                    Past Attendance
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Summary of recent classes</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-200 rounded-full transition shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                                    <p>Loading history...</p>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <p>No past attendance records found.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((record) => (
                                        <div
                                            key={record.date}
                                            onClick={() => viewDate(record.date)}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition group"
                                        >
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {new Date(record.date).toLocaleDateString('en-GB', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    <span className="font-medium text-green-600">{record.present} Present</span> 
                                                    <span className="mx-2">•</span> 
                                                    <span className="font-medium text-slate-400">{record.total - record.present} Absent</span>
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition">
                                                <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
