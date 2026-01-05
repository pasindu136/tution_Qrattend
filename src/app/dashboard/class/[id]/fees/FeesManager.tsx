
'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Calendar, Banknote, Search, CheckCircle, Trash2, Loader2, Plus } from 'lucide-react'
import { recordPayment, removePayment } from "./actions"
import { motion } from "framer-motion"
import ClassNav from "@/components/dashboard/ClassNav"

export default function FeesManager({
    classId,
    classFee,
    students,
    initialMonth,
    paymentsData,
    ownerId,
    currentUserId
}: {
    classId: string,
    classFee: number,
    students: any[],
    initialMonth: string,
    paymentsData: any[],
    ownerId?: string,
    currentUserId?: string
}) {
    const [month, setMonth] = useState(initialMonth)
    const [searchQuery, setSearchQuery] = useState("")
    const [processingId, setProcessingId] = useState<string | null>(null)

    // Admin View Check
    const isAdminView = ownerId && currentUserId && ownerId !== currentUserId;

    // Filter students
    const filteredStudents = students.filter(student =>
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.tute_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Payments Map: StudentID -> PaymentObject
    const paymentsMap = new Map()
    paymentsData.forEach(p => paymentsMap.set(p.student_id, p))

    // Stats
    const totalCollected = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0)
    const paidCount = paymentsData.length
    const pendingCount = students.length - paidCount

    async function handleMarkPaid(studentId: string) {
        if (processingId) return;

        // Admin Confirmation
        if (isAdminView) {
            const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are recording a payment for ANOTHER user's student.\nAre you sure you want to proceed?");
            if (!confirmed) return;
        }

        setProcessingId(studentId)

        try {
            // Use class fee by default
            await recordPayment(classId, studentId, month, classFee)
        } finally {
            setProcessingId(null)
        }
    }

    async function handleRemovePayment(paymentId: string) {
        let message = "Are you sure you want to remove this payment record?";
        if (isAdminView) {
            message = "⚠️ ADMIN WARNING:\n\nYou are REMOVING a payment from ANOTHER user's class.\nThis action is irreversible.\nAre you absolutely sure?";
        }

        if (!confirm(message)) return;

        if (processingId) return;
        setProcessingId(paymentId) // Use payment ID as loading state key just to block actions

        try {
            await removePayment(paymentId, classId)
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Admin Banner */}
            {isAdminView && (
                <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center mb-6 sticky top-0 z-40">
                    <span className="flex items-center gap-2">
                        <span>⚠️</span>
                        You are viewing <span className="underline">another user's</span> fees.
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
                    <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
                    <p className="text-slate-500">Track monthly fee payments.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={classId} activeTab="fees" />

            {/* Controls & Month Picker */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-bold text-slate-400">Select Month</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => {
                                window.location.href = `fees?month=${e.target.value}`
                            }}
                            className="pl-4 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Collected</p>
                        <p className="text-xl font-bold text-green-600">LKR {totalCollected.toLocaleString()}</p>
                    </div>
                    <div className="text-center pl-6 border-l border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Paid / Total</p>
                        <p className="text-xl font-bold text-slate-900">{paidCount} <span className="text-slate-400 text-sm">/ {students.length}</span></p>
                    </div>
                </div>
            </div>

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
                    const payment = paymentsMap.get(student.id)
                    const isPaid = !!payment
                    const isLoading = processingId === student.id || (payment && processingId === payment.id)

                    return (
                        <div
                            key={student.id}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${isPaid
                                ? 'bg-white border-green-200'
                                : 'bg-white border-slate-100'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isPaid ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {getInitials(student.full_name)}
                                </div>
                                <div>
                                    <p className={`font-bold ${isPaid ? 'text-green-900' : 'text-slate-900'}`}>
                                        {student.full_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {student.tute_id || student.phone || "No ID"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isPaid ? (
                                    <>
                                        <div className="flex flex-col items-end mr-2">
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wide">Paid</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5">{new Date(payment.paid_at).toLocaleDateString()}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemovePayment(payment.id)}
                                            disabled={isLoading}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleMarkPaid(student.id)}
                                        disabled={isLoading}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-slate-900/10 transition-transform active:scale-95 flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Pay <span className="hidden sm:inline">LKR {classFee}</span></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function getInitials(name: string) {
    return name
        ?.split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || '?'
}
