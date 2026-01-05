'use client'

import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/login/actions' // Server Action
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'

export default function SidebarProfile({ initialUser }: { initialUser: any }) {
    const searchParams = useSearchParams()
    const overrideUid = searchParams.get('uid')
    const [user, setUser] = useState(initialUser)

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
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-800 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate w-32">{name}</p>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Pro Plan</p>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <form action={signOut}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 rounded-lg transition-colors font-bold">
                    <LogOut size={16} />
                    Sign Out
                </button>
            </form>
        </div>
    )
}
