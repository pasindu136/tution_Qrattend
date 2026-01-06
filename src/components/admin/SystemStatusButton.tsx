'use client';

import { useState } from 'react';
import { sendSystemStatusReport } from '@/app/admin/actions';
import { Activity, Loader2 } from 'lucide-react';

export default function SystemStatusButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await sendSystemStatusReport(true);
            alert("✅ Status Report sent to your email!");
        } catch (error: any) {
            console.error(error);
            alert("❌ Failed to send report: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
            title="Send System Status Report Now"
        >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
            <span className="text-sm font-bold hidden md:inline">Status Report</span>
        </button>
    );
}
