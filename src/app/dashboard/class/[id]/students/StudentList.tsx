
'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Calendar, Banknote, Plus, Trash2, Edit2, Search, Phone, Hash, Clock } from 'lucide-react'
import StudentModal from "./StudentModal"
import { deleteStudent } from "./actions"
import ClassNav from "@/components/dashboard/ClassNav"
import ConfirmationModal from "@/components/ui/ConfirmationModal"

import { createClient } from "@/utils/supabase/client"

export default function StudentList({ classId, initialStudents, ownerId, currentUserId }: { classId: string, initialStudents: any[], ownerId?: string, currentUserId?: string }) {
    const [students, setStudents] = useState(initialStudents)
    const [searchQuery, setSearchQuery] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStudent, setEditingStudent] = useState<any>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, studentId: string | null }>({ isOpen: false, studentId: null })

    const isAdminView = ownerId && currentUserId && ownerId !== currentUserId;

    // Filter students locally for search
    const filteredStudents = initialStudents.filter(student =>
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.tute_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function handleDelete(studentId: string) {
        setDeleteConfirmation({ isOpen: true, studentId })
    }

    async function confirmDelete() {
        // Admin Confirmation for Delete
        if (ownerId) {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.id !== ownerId) {
                const confirmed = window.confirm("⚠️ ADMIN WARNING:\n\nYou are REMOVING a student from another user's class.\nThis action is irreversible.\nAre you absolutely sure?");
                if (!confirmed) {
                    setDeleteConfirmation({ isOpen: false, studentId: null });
                    return;
                }
            }
        }

        if (deleteConfirmation.studentId) {
            await deleteStudent(classId, deleteConfirmation.studentId)
            setDeleteConfirmation({ isOpen: false, studentId: null })
        }
    }

    return (
        <div className="min-h-screen pb-20">

            {/* Admin Banner */}
            {isAdminView && (
                <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center mb-6 sticky top-0 z-40">
                    <span className="flex items-center gap-2">
                        <span>⚠️</span>
                        You are viewing <span className="underline">another user's</span> student list.
                    </span>
                    <Link href={`/admin/tutors/${ownerId}`} className="underline hover:text-amber-900">
                        Back to Tutor Dashboard
                    </Link>
                </div>
            )}
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/dashboard/class/${classId}`} className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
                    <p className="text-slate-500">Add, edit or remove students.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={classId} activeTab="students" />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sticky top-4 z-20 bg-slate-50/90 backdrop-blur-sm p-1 -mx-1 lg:static lg:bg-transparent lg:p-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-blue-500 outline-none transition shadow-sm"
                    />
                </div>
                <button
                    onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} /> <span className="hidden sm:inline">Add Student</span><span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hidden md:block">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4 px-6">Student Name</th>
                            <th className="p-4">Phone Number</th>
                            <th className="p-4">Tute ID / Index</th>
                            <th className="p-4">Joined Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                        {student.full_name.charAt(0)}
                                    </div>
                                    {student.full_name}
                                </td>
                                <td className="p-4">{student.phone || "-"}</td>
                                <td className="p-4">
                                    {student.tute_id ? (
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold font-mono">
                                            {student.tute_id}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="p-4 text-slate-400 text-xs">
                                    {new Date(student.joined_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No students found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View (Visible ONLY on Mobile) */}
            <div className="md:hidden flex flex-col gap-3">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">
                                    {student.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{student.full_name}</h3>
                                    {student.tute_id && (
                                        <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wide">
                                            {student.tute_id}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => { setEditingStudent(student); setIsModalOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg transition"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded-lg">
                                <Phone size={14} />
                                <span className="font-medium text-slate-700">{student.phone || "No Phone"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded-lg">
                                <Clock size={14} />
                                <span className="font-medium text-slate-700">{new Date(student.joined_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredStudents.length === 0 && (
                    <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No students found.</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, studentId: null })}
                onConfirm={confirmDelete}
                title="Remove Student?"
                message="Are you sure you want to remove this student from the class? All attendance and fee records for this student will also be deleted."
                confirmText="Yes, Remove"
                cancelText="Cancel"
                isDangerous={true}
            />

            <StudentModal
                classId={classId}
                student={editingStudent}
                isOpen={isModalOpen}
                ownerId={ownerId}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}
