
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Banknote, Calendar, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { signOut } from "@/app/login/actions";

export default function MobileNav({ user }: { user: any }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
        { href: "/dashboard/students", icon: Users, label: "Students" },
        { href: "/dashboard/attendance", icon: Calendar, label: "Attendance" },
        { href: "/dashboard/fees", icon: Banknote, label: "Payments" },
    ];

    const name = user?.full_name || "Tutor"
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()


    return (
        <>
            {/* Spacer to prevent content from being hidden behind user nav */}
            <div className="h-20 lg:hidden" />

            {/* Bottom Navigation Bar */}
            <nav
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 px-6 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
            >
                <div className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] font-bold ${isActive ? "opacity-100" : "opacity-0 hidden"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More / Profile Trigger */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isMenuOpen ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {initials}
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay (Profile & Logout) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Content */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-200">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/30">
                                {initials}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                                <p className="text-sm text-blue-600 font-bold">Pro Plan</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <form action={signOut}>
                                <button className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition">
                                    Sign Out
                                </button>
                            </form>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
