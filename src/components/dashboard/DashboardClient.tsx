'use client';

import Link from "next/link";
import { ArrowRight, Users, Banknote, GraduationCap, LayoutGrid } from "lucide-react";
import CreateClassModal from "@/app/dashboard/CreateClassModal";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper to format time
function formatTime(timeStr: string) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

interface DashboardClientProps {
    classes: any[];
    profile: any;
    netRevenue: number;
    monthlyGrossRevenue: number;
    monthlyExpenses: number;
    userId: string;
    isOwner: boolean;
    greeting: string;
    showPaymentWarning: boolean;
    daysRemaining: number;
    nextBillingStr: string | null;
}

export default function DashboardClient({
    classes,
    profile,
    netRevenue,
    monthlyGrossRevenue,
    monthlyExpenses,
    userId,
    isOwner,
    greeting,
    showPaymentWarning,
    daysRemaining,
    nextBillingStr
}: DashboardClientProps) {
    const { t } = useLanguage();

    // Greeting translation logic could be here, but simpler to keep generic or map it
    const name = profile?.full_name?.split(' ')[0] || "Tutor";

    return (
        <div className="pb-20">

            {/* Payment Warning Banner */}
            {showPaymentWarning && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <Banknote size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900 text-sm">Monthly Service Fee Due Soon</h3>
                            <p className="text-red-700 text-xs mt-0.5">
                                Your subscription expires in <span className="font-bold">{daysRemaining} days</span> ({nextBillingStr}).
                                Please make your payment to avoid automated account suspension.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Improved Header */}
            <div className="flex flex-col gap-1 mb-8">
                <p className="text-slate-500 font-medium text-sm lg:text-base uppercase tracking-wider">{t.dashboard.welcome}</p>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap">
                        {isOwner ? name : `${profile?.full_name || 'Tutor'}`}
                        <span className="text-blue-600 hidden lg:inline">.</span>
                    </h1>
                    {/* Mobile Create Button (Icon Only) or Desktop Button */}
                    <div className="block">
                        <CreateClassModal ownerId={userId} />
                    </div>
                </div>
            </div>

            {/* 2. Mobile Stats (Compact & Single Row) */}
            <div className="grid grid-cols-3 gap-3 mb-8 md:hidden">
                {/* Students */}
                <div className="bg-white p-3 py-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mb-2">
                        <Users size={16} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 leading-none mb-1">
                        {classes?.reduce((acc: number, cls: any) => acc + (cls.students?.[0]?.count || 0), 0) || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.students}</span>
                </div>

                {/* Income */}
                <div className="bg-white p-3 py-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg mb-2">
                        <Banknote size={16} />
                    </div>
                    <span className="text-lg font-bold text-slate-900 leading-none mb-1 flex items-center justify-center">
                        <span className="text-[10px] text-slate-400 mr-0.5">LKR</span>
                        {(netRevenue / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net</span>
                </div>

                {/* Classes */}
                <div className="bg-white p-3 py-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mb-2">
                        <GraduationCap size={16} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 leading-none mb-1">
                        {classes?.length || 0}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
                </div>
            </div>

            {/* 2. Desktop Stats (Original - Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {/* Stats Card 1 */}
                <div className="min-w-[260px] lg:min-w-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{t.dashboard.total_students}</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                {classes?.reduce((acc: number, cls: any) => acc + (cls.students?.[0]?.count || 0), 0) || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <Link href="/dashboard/students" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                            {t.dashboard.view_details} <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Stats Card 2 - NET REVENUE */}
                <div className="min-w-[260px] lg:min-w-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex justify-between items-start w-full">
                        <div className="w-full">
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{t.dashboard.net_income}</p>
                            <h3 className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">
                                <span className="text-lg text-slate-400">LKR</span>
                                {netRevenue.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400">
                                <span>Gross: {monthlyGrossRevenue.toLocaleString()}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-red-400">Exp: -{monthlyExpenses.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-2xl text-green-600 absolute right-0 top-0">
                            <Banknote size={20} />
                        </div>
                    </div>
                </div>

                {/* Stats Card 3 */}
                <div className="min-w-[260px] lg:min-w-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{t.dashboard.active_classes}</p>
                            <h3 className="text-3xl font-bold text-slate-900">
                                {classes?.length || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <GraduationCap size={20} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                            {isOwner ? "Your Schedule" : "Tutor Schedule"}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. My Classes Section */}
            <div className="flex items-center gap-2 mb-6">
                <LayoutGrid size={20} className="text-slate-400" />
                <h2 className="text-xl font-bold text-slate-900">
                    {isOwner ? t.dashboard.my_classes : "Tutor Classes"}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {classes?.map((cls: any, index: number) => {
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-rose-500'];
                    const bgs = ['bg-blue-50', 'bg-purple-50', 'bg-orange-50', 'bg-emerald-50', 'bg-rose-50'];
                    const textColors = ['text-blue-600', 'text-purple-600', 'text-orange-600', 'text-emerald-600', 'text-rose-600'];

                    const colorIndex = index % colors.length;
                    const accentColor = colors[colorIndex];
                    const softBg = bgs[colorIndex];
                    const textColor = textColors[colorIndex];

                    return (
                        <Link key={cls.id} href={isOwner ? `/dashboard/class/${cls.id}` : `/dashboard/class/${cls.id}?uid=${userId}`}>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all group cursor-pointer relative h-full">

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wide ${softBg} ${textColor}`}>
                                        {cls.subject}
                                    </div>
                                    <div className={`w-10 h-10 rounded-full ${softBg} ${textColor} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110`}>
                                        <ArrowRight size={18} />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{cls.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                        {cls.day} • {formatTime(cls.time)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[...Array(Math.min(3, cls.students?.[0]?.count || 0))].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold text-slate-600">
                                            {cls.students?.[0]?.count || 0} Students
                                        </p>
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm">LKR {cls.fee_amount}</p>
                                </div>

                            </div>
                        </Link>
                    )
                })}

                {/* Empty State */}
                {!classes?.length && (
                    <div className="col-span-full py-16 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                            <LayoutGrid size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{t.dashboard.no_classes}</h3>
                        <p className="text-slate-500 text-sm mb-6">{t.dashboard.get_started}</p>
                        <div className="flex justify-center">
                            <CreateClassModal ownerId={userId} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
