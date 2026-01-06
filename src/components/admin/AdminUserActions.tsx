'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Trash2, Ban, CheckCircle, ExternalLink } from 'lucide-react';
import { deleteUserAccount, suspendUser, approveUser } from '@/app/admin/actions';

interface AdminUserActionsProps {
    profile: {
        id: string;
        is_approved: boolean;
        role: string;
    };
    isMobile?: boolean;
}

export default function AdminUserActions({ profile, isMobile = false }: AdminUserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (profile.role === 'admin') {
        if (isMobile) {
            return (
                <div className="col-span-2 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-bold text-center">
                    Admin Account
                </div>
            );
        }
        return null;
    }

    const handleAction = async (action: () => Promise<void>, confirmMsg?: string) => {
        if (confirmMsg && !confirm(confirmMsg)) return;

        setIsLoading(true);
        try {
            await action();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Action failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isMobile) {
        return (
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                {/* Manage Dashboard */}
                <Link
                    href={`/admin/tutors/${profile.id}`}
                    className="col-span-2 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95 transition text-center"
                >
                    Manage Dashboard
                </Link>

                {/* Approve / Suspend */}
                {profile.is_approved ? (
                    <button
                        disabled={isLoading}
                        onClick={() => handleAction(() => suspendUser(profile.id))}
                        className="w-full py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold border border-amber-100 active:scale-95 transition flex justify-center items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Suspend"}
                    </button>
                ) : (
                    <button
                        disabled={isLoading}
                        onClick={() => handleAction(() => approveUser(profile.id))}
                        className="w-full py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 active:scale-95 transition flex justify-center items-center gap-2"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Approve"}
                    </button>
                )}

                {/* DELETE */}
                <button
                    disabled={isLoading}
                    onClick={() => handleAction(
                        () => deleteUserAccount(profile.id),
                        "⚠️ DANGER: PERMANENTLY DELETE USER?\n\nThis will wipe all data including:\n- Profile & Login\n- Students\n- Classes\n- Payments\n\nThis cannot be undone. Are you sure?"
                    )}
                    className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 active:scale-95 transition flex justify-center items-center gap-2"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Delete</>}
                </button>
            </div>
        );
    }

    // Desktop View
    return (
        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Manage Dashboard */}
            <Link
                href={`/admin/tutors/${profile.id}`}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1"
            >
                Manage
            </Link>

            {/* Suspend / Approve */}
            {profile.is_approved ? (
                <button
                    disabled={isLoading}
                    onClick={() => handleAction(() => suspendUser(profile.id))}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition border border-amber-200 flex items-center gap-1 disabled:opacity-50"
                    title="Suspend User"
                >
                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : "Suspend"}
                </button>
            ) : (
                <button
                    disabled={isLoading}
                    onClick={() => handleAction(() => approveUser(profile.id))}
                    className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition border border-green-200 flex items-center gap-1 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 size={12} className="animate-spin" /> : "Approve"}
                </button>
            )}

            {/* DELETE USER */}
            <button
                disabled={isLoading}
                onClick={() => handleAction(
                    () => deleteUserAccount(profile.id),
                    "⚠️ DANGER: PERMANENTLY DELETE USER?\n\nThis will wipe all data including:\n- Profile & Login\n- Students\n- Classes\n- Payments\n\nThis cannot be undone. Are you sure?"
                )}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition border border-red-200 flex items-center gap-1 disabled:opacity-50"
                title="Permanently Delete"
            >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
        </div>
    );
}
