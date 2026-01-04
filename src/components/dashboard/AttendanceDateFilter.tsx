'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

export default function AttendanceDateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

    return (
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
            <input
                type="date"
                value={date}
                onChange={(e) => {
                    const newDate = e.target.value;
                    const params = new URLSearchParams(searchParams);
                    params.set('date', newDate);
                    router.push(`?${params.toString()}`);
                }}
                className="px-3 py-2 text-sm font-bold text-slate-700 outline-none bg-transparent cursor-pointer hover:bg-slate-50 rounded-md transition"
            />
        </div>
    );
}
