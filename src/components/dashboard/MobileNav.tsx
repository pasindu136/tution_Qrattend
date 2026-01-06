'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Banknote, Calendar, MoreHorizontal, MessageCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { signOut } from "@/app/login/actions";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";

export default function MobileNav({ user }: { user: any }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useLanguage();

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: t.nav.home },
        { href: "/dashboard/students", icon: Users, label: t.nav.students },
        { href: "/dashboard/attendance", icon: Calendar, label: t.nav.attendance },
        { href: "/dashboard/fees", icon: Banknote, label: t.nav.payments },
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

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/30">
                                {initials}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                                <p className="text-sm text-blue-600 font-bold">{t.nav.pro_plan}</p>
                            </div>
                        </div>

                        <div className="mb-6 flex justify-center">
                            <LanguageSwitcher />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wilder mb-3">{t.nav.support_contact}</h4>

                            <a
                                href={`https://wa.me/94767664172?text=${encodeURIComponent(`Hello, I'm ${name}. I need help with TuitionMate.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl mb-2 hover:bg-green-100 transition border border-green-100"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                                    <MessageCircle size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{t.nav.chat_whatsapp}</p>
                                    <p className="text-xs opacity-75">{t.nav.instant_support}</p>
                                </div>
                            </a>

                            <div className="space-y-2 mt-3 px-1">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={14} className="text-slate-400" />
                                    <span className="text-sm font-medium">076 766 4172</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail size={14} className="text-slate-400" />
                                    <span className="text-sm font-medium">pasindusandamal344@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <form action={signOut}>
                                <button className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition">
                                    {t.nav.sign_out}
                                </button>
                            </form>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                            >
                                {t.nav.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
