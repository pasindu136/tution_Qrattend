'use client';

import { useState } from 'react';
import { toggleUnlimited, adjustSubscriptionDays } from '@/app/admin/actions';
import { Settings, RefreshCw, Infinity, CalendarClock } from 'lucide-react';


export default function SubscriptionManager({
    userId,
    initialDate,
    isUnlimited,
    role
}: {
    userId: string,
    initialDate: string | null,
    isUnlimited: boolean,
    role: string
}) {
    const [daysInput, setDaysInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isExpired = initialDate ? new Date(initialDate) < new Date() : false;
    const nextBilling = initialDate ? new Date(initialDate) : null;
    const daysRemaining = nextBilling ? Math.ceil((nextBilling.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const handleToggleUnlimited = async () => {
        setIsLoading(true);
        await toggleUnlimited(userId, !isUnlimited);
        setIsLoading(false);
    };

    const handleAdjustDays = async () => {
        if (!daysInput) return;
        setIsLoading(true);
        await adjustSubscriptionDays(userId, parseInt(daysInput));
        setDaysInput('');
        setIsLoading(false);
    };

    if (role === 'admin') {
        return <span className="text-purple-600 font-bold text-xs uppercase bg-purple-100 px-2 py-1 rounded">Super Admin</span>;
    }

    return (
        <div className="flex flex-col gap-2">

            {/* Status & Toggle */}
            <div className="flex items-center justify-between gap-4">
                {isUnlimited ? (
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded-lg">
                        <Infinity size={14} />
                        Unlimited
                    </div>
                ) : (
                    <div className={`flex flex-col leading-none ${isExpired ? 'text-red-500' : 'text-slate-600'}`}>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Expires On</span>
                        <span className="text-xs font-bold font-mono">
                            {initialDate ? new Date(initialDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-[10px] font-bold mt-0.5">
                            {daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expired'}
                        </span>
                    </div>
                )}

                <button
                    onClick={handleToggleUnlimited}
                    className={`p-1.5 rounded-lg transition ${isUnlimited ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                    title="Toggle Unlimited Access"
                    disabled={isLoading}
                >
                    <Infinity size={16} />
                </button>
            </div>

            {/* Adjuster (Only if not unlimited) */}
            {!isUnlimited && (
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        placeholder="+/- Days"
                        value={daysInput}
                        onChange={(e) => setDaysInput(e.target.value)}
                        className="w-16 text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-500 bg-white"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleAdjustDays}
                        disabled={isLoading || !daysInput}
                        className="p-1 px-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 text-[10px] font-bold"
                    >
                        Adjust
                    </button>
                </div>
            )}
        </div>
    );
}
