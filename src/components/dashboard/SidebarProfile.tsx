'use client'

import { useState, useEffect } from 'react'
import { LogOut, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react'
import { signOut } from '@/app/login/actions' // Server Action
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import LanguageSwitcher from '../LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SidebarProfile({ initialUser }: { initialUser: any }) {
    const searchParams = useSearchParams()
    const overrideUid = searchParams.get('uid')
    const [user, setUser] = useState(initialUser)
    const { t } = useLanguage();

    useEffect(() => {
        async function loadOverride() {
            if (overrideUid && overrideUid !== initialUser?.id) {
                const supabase = createClient()
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', overrideUid)
                    .single()

                if (data) {
                    setUser(data)
                }
            } else {
                setUser(initialUser)
            }
        }
        loadOverride()
    }, [overrideUid, initialUser])

    const name = user?.full_name || "Tutor"
    const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

    return (
        <div className="p-4 border-t border-slate-800">
            {/* Language Switcher */}
            <div className="mb-4">
                <LanguageSwitcher className="bg-slate-700/50" />
            </div>

            {/* Support Section - Collapsible */}
            <div className="mb-3">
                <button
                    onClick={() => setUser(prev => ({ ...prev, _showSupport: !prev?._showSupport }))}
                    className="w-full flex items-center justify-between text-slate-400 hover:text-white mb-2 text-xs font-bold uppercase tracking-wider transition group"
                >
                    <span>{t.nav.need_help}</span>
                    <HelpCircle size={14} className="group-hover:text-blue-400 transition" />
                </button>

                {user?._showSupport && (
                    <div className="bg-slate-800/50 rounded-xl p-3 mb-3 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <a
                            href={`https://wa.me/94767664172?text=${encodeURIComponent(`Hello, I'm ${name}. I need help with TuitionMate.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-green-500/10 text-green-400 rounded-lg mb-2 hover:bg-green-500/20 transition border border-green-500/20 text-xs font-bold"
                        >
                            <MessageCircle size={14} />
                            {t.nav.chat_whatsapp}
                        </a>
                        <div className="space-y-1.5 px-1">
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                                <Phone size={10} /> 076 766 4172
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium truncate" title="pasindusandamal344@gmail.com">
                                <Mail size={10} /> Support Email
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 p-3 bg-slate-800 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate w-32">{name}</p>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{t.nav.pro_plan}</p>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <form action={signOut}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 rounded-lg transition-colors font-bold">
                    <LogOut size={16} />
                    {t.nav.sign_out}
                </button>
            </form>
        </div>
    )
}
