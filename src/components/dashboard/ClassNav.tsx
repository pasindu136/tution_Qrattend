
import Link from "next/link";
import { Users, Calendar, Banknote, Info, Receipt } from 'lucide-react';

export default function ClassNav({ classId, activeTab }: { classId: string, activeTab: 'details' | 'students' | 'attendance' | 'fees' | 'expenses' }) {

    // Define tabs
    const tabs = [
        { id: 'details', label: 'Details', icon: Info, href: `/dashboard/class/${classId}` },
        { id: 'students', label: 'Students', icon: Users, href: `/dashboard/class/${classId}/students` },
        { id: 'attendance', label: 'Attendance', icon: Calendar, href: `/dashboard/class/${classId}/attendance` },
        { id: 'fees', label: 'Fees', icon: Banknote, href: `/dashboard/class/${classId}/fees` },
        { id: 'expenses', label: 'Expenses', icon: Receipt, href: `/dashboard/class/${classId}/expenses` },
    ];

    return (
        <div className="bg-slate-100/50 p-1.5 rounded-2xl mb-8">
            <div className="grid grid-cols-5 gap-1 md:flex md:gap-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`
                                flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 py-3 px-2 md:px-5 rounded-xl transition-all duration-200
                                ${isActive
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }
                            `}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] md:text-sm font-bold">{tab.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
