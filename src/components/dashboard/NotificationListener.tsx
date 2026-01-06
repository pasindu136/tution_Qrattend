'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { markNotificationAsRead } from '@/app/admin/actions';
import { X, Bell, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationListener({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            setNotifications(data);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('realtime_notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${userId}`
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setIsOpen(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notifications.length <= 1) setIsOpen(false);
        router.refresh();
    };

    const handleDismiss = () => {
        setIsOpen(false);
    };

    if (!isOpen || notifications.length === 0) return null;

    // Mobile: Top "Popup" Toast (Sleek & Non-intrusive)
    if (isMobile) {
        return (
            <div className="fixed top-0 left-4 right-4 z-[100] pt-safe flex flex-col items-center gap-3 pointer-events-none mt-4">
                {notifications.map((n, index) => (
                    <div
                        key={n.id}
                        className="w-full max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 animate-in slide-in-from-top duration-500 pointer-events-auto flex gap-4 items-start ring-1 ring-black/5"
                        style={{ marginTop: index !== 0 ? '-10px' : '0', scale: `${1 - (index * 0.05)}`, opacity: `${1 - (index * 0.2)}`, display: index > 2 ? 'none' : 'flex' }}
                    >
                        <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                            <Bell size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-slate-900 text-sm">New Notification</h3>
                                <button
                                    onClick={() => handleMarkAsRead(n.id)}
                                    className="text-slate-400 hover:text-slate-600 p-1 -mr-2 -mt-2"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                                {n.message}
                            </p>
                            <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50/50 px-2 py-1 rounded-lg w-fit transition"
                            >
                                <Check size={14} /> Mark as Read
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Desktop: Sleek Floating Toast (Bottom Right)
    return (
        <div className="fixed bottom-8 right-8 z-[100] w-96 space-y-4 animate-in slide-in-from-right-1/2 duration-500 ease-out">
            {notifications.map(n => (
                <div key={n.id} className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">

                    {/* Decorative background glow */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                                    <Bell size={14} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-100">New Message</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">Just now</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-lg"
                                title="Dismiss"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed font-medium pl-11 mb-4">
                            {n.message}
                        </p>

                        <div className="pl-11">
                            <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition group-hover:translate-x-1"
                            >
                                <Check size={14} /> Mark as Read
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
