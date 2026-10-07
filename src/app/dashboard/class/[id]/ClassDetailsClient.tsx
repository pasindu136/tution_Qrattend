'use client';

import Link from "next/link";
import { ArrowLeft, Users, Calendar, Banknote } from 'lucide-react';
import ClassNav from "@/components/dashboard/ClassNav";
import EditClassModal from "./EditClassModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClassDetailsClientProps {
    classData: any;
    studentCount: number;
    isAdmin: boolean;
    isOwner: boolean;
    classId: string;
}

export default function ClassDetailsClient({ classData, studentCount, isAdmin, isOwner, classId }: ClassDetailsClientProps) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen">

            {/* Admin Impersonation Warning */}
            {isAdmin && !isOwner && (
                <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center mb-6 sticky top-0 z-40">
                    <span className="flex items-center gap-2">
                        <span>⚠️</span>
                        You are viewing <span className="underline">another user's</span> class as Admin.
                    </span>
                    <Link href={`/admin/tutors/${classData.teacher_id}`} className="underline hover:text-amber-900">
                        Back to Tutor Dashboard
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={isAdmin && !isOwner ? `/admin/tutors/${classData.teacher_id}` : "/dashboard"}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{classData.name}</h1>
                        <p className="text-slate-500">{classData.subject} • {classData.day} at {classData.time}</p>
                    </div>
                </div>
                <EditClassModal classData={classData} />
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={classId} activeTab="details" />

            {/* Overview & Quick Actions */}
            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Manage Your Class</h2>
                        <p className="text-blue-100 max-w-md text-sm md:text-base">
                            Everything you need to manage your students, attendance, and fees in one place.
                        </p>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href={`/dashboard/class/${classId}/attendance`} className="bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-sm hover:shadow-md group">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Mark Attendance</h4>
                                <p className="text-xs text-slate-500 font-medium">Scan cards or mark manual</p>
                            </div>
                        </Link>
                        
                        <Link href={`/dashboard/class/${classId}/fees`} className="bg-white hover:bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-sm hover:shadow-md group">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Banknote size={28} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Collect Fees</h4>
                                <p className="text-xs text-slate-500 font-medium">Record student payments</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Class Details Stats (Horizontal) */}
                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-3">Class Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.class_details.students}</p>
                                <p className="text-2xl font-bold text-slate-900">{studentCount || 0}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Banknote size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.class_details.class_fee}</p>
                                <p className="text-2xl font-bold text-slate-900"><span className="text-sm font-medium text-slate-500 mr-1">LKR</span>{classData.fee_amount}</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center gap-3 hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.class_details.schedule}</p>
                                <p className="font-bold text-slate-900">{classData.day}</p>
                                <p className="text-sm text-slate-500">{classData.time}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
