
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Calendar, Banknote, Search, CheckCircle, Save, Loader2, History } from 'lucide-react'
import { saveAttendance } from "./actions"
import { motion, AnimatePresence } from "framer-motion"
import CustomDatePicker from "@/components/ui/CustomDatePicker"
import ClassNav from "@/components/dashboard/ClassNav"

export default function AttendanceManager({
    classId,
    students,
    initialDate,
    attendanceData,
    ownerId,
    currentUserId
}: {
    classId: string,
    students: any[],
    initialDate: string,
    attendanceData: any[],
    ownerId?: string,
    currentUserId?: string
}) {
    const router = useRouter()
    const [date, setDate] = useState(initialDate)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Admin View Check
    const isAdminView = ownerId && currentUserId && ownerId !== currentUserId;

    // Map StudentID -> Status
    const [localAttendance, setLocalAttendance] = useState<Record<string, string>>({})

    // Sync date state with prop
    useEffect(() => {
        setDate(initialDate)
    }, [initialDate])

    // Initialize/Reset local state when props change
    useEffect(() => {
        const map: Record<string, string> = {}
        attendanceData.forEach(record => {
            map[record.student_id] = record.status
        })
        setLocalAttendance(map)
        setHasChanges(false)
    }, [attendanceData])

    // Filter students
    const filteredStudents = students.filter(student =>
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.tute_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Stats
    const presentCount = Object.values(localAttendance).filter(s => s === 'present').length
    const percentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0

    function toggleAttendance(studentId: string) {
        const currentStatus = localAttendance[studentId]
        const newStatus = currentStatus === 'present' ? 'absent' : 'present'

        setLocalAttendance(prev => ({
            ...prev,
            [studentId]: newStatus
        }))
        setHasChanges(true)
    }

    async function handleSave() {
        if (isSaving) return;

        // Admin Confirmation
        if (isAdminView) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are saving attendance for ANOTHER user's class.\nAre you sure you want to proceed?");
            if (!confirmed) return;
        }

        setIsSaving(true);

        const records = Object.entries(localAttendance).map(([studentId, status]) => ({
            student_id: studentId,
            status
        }));

        try {
            const result = await saveAttendance(classId, date, records)
            if (result?.success) {
                setHasChanges(false)
            } else {
                alert("Failed to save attendance")
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Admin Banner */}
            {isAdminView && (
                <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center mb-6 sticky top-0 z-40">
                    <span className="flex items-center gap-2">
                        <span>⚠️</span>
                        You are viewing <span className="underline">another user's</span> attendance.
                    </span>
                    <Link href={`/admin/tutors/${ownerId}`} className="underline hover:text-amber-900">
                        Back to Tutor Dashboard
                    </Link>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={isAdminView ? `/admin/tutors/${ownerId}` : `/dashboard/class/${classId}`} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mark Attendance</h1>
                    <p className="text-slate-500">Track student attendance for the day.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={classId} activeTab="attendance" />

            {/* Controls & Date Picker */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-6 flex flex-col items-center gap-6 sticky top-4 z-20 lg:flex-row lg:justify-between">

                {/* Date Picker - Full Width on Mobile */}
                <div className="w-full lg:w-auto">
                    <div className="relative z-50">
                        <label className="absolute -top-2.5 left-2 px-1 text-[10px] font-bold text-slate-400 bg-white z-10">Select Date</label>
                        <div className="w-full">
                            <CustomDatePicker
                                date={date}
                                onChange={(newDate) => {
                                    if (hasChanges && !confirm("You have unsaved changes. Are you sure you want to switch dates?")) return;
                                    // Use replace to avoid stacking history or push to adding
                                    router.push(`?date=${newDate}`)
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Separator - Visible on Mobile */}
                <div className="w-full h-px bg-slate-100 lg:hidden"></div>

                {/* Stats Summary - Centered Grid on Mobile */}
                <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-8 w-full lg:w-auto relative">
                    <div className="text-center flex flex-col items-center justify-center p-2 rounded-xl bg-green-50/50 lg:bg-transparent lg:p-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Present</p>
                        <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                    </div>

                    {/* Vertical Divider for Mobile */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-slate-200 lg:hidden"></div>

                    <div className="text-center flex flex-col items-center justify-center p-2 rounded-xl bg-red-50/50 lg:bg-transparent lg:p-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Absent</p>
                        <p className="text-2xl font-bold text-red-500">{students.length - presentCount}</p>
                    </div>

                    <div className="hidden lg:block text-center pl-6 border-l border-slate-100">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shadow-inner">
                            {percentage}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button (Floating) */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-24 lg:bottom-6 right-6 z-50"
                    >
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 transform transition hover:scale-105 active:scale-95"
                        >
                            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? "Saving..." : "Save Daily Attendance"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Student List */}
            <div className="flex flex-col gap-3">
                {/* Search */}
                <div className="relative mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none transition"
                    />
                </div>

                {filteredStudents.map((student) => {
                    const status = localAttendance[student.id]
                    const isPresent = status === 'present'

                    return (
                        <div
                            key={student.id}
                            onClick={() => toggleAttendance(student.id)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group select-none ${isPresent
                                ? 'bg-green-50 border-green-200 hover:border-green-300 shadow-sm'
                                : 'bg-white border-slate-100 hover:border-blue-200 shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isPresent ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {student.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p className={`font-bold transition-colors ${isPresent ? 'text-green-900' : 'text-slate-900'}`}>
                                        {student.full_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {student.tute_id || student.phone || "No ID"}
                                    </p>
                                </div>
                            </div>

                            <div className="pr-2 transform transition-transform group-active:scale-90">
                                {isPresent ? (
                                    <CheckCircle className="text-green-600 w-8 h-8 drop-shadow-sm" fill="currentColor" size={32} stroke="white" strokeWidth={2.5} />
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-blue-400 transition-colors bg-white"></div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
