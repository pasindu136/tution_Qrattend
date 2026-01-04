
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";

export default async function AllAttendancePage({ searchParams }: { searchParams: { date?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    const date = searchParams.date || format(new Date(), 'yyyy-MM-dd');
    const displayDate = format(new Date(date), 'EEEE, MMMM dd, yyyy');

    // 1. Get User's Classes
    const { data: classes } = await supabase.from('classes').select('id, name, time').eq('teacher_id', user.id).order('time');
    const classIds = classes?.map(c => c.id) || [];

    // 2. Get Attendance for Date
    const { data: attendance } = await supabase
        .from('attendance')
        .select('*, students(full_name), classes(name)')
        .in('class_id', classIds)
        .eq('date', date)
        .eq('status', 'present');

    // Group by Class
    const attendanceByClass = attendance?.reduce((acc: any, record: any) => {
        const clsId = record.class_id;
        if (!acc[clsId]) acc[clsId] = [];
        acc[clsId].push(record);
        return acc;
    }, {});


    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance Overview</h1>
                    <p className="text-slate-500">{displayDate}</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="p-2 border rounded-lg"
                        defaultValue={date}
                    />
                    {/* Note: Client side navigation needed for input change to reload page with new param, 
                        skipping for simplicity in this MVP server component view 
                    */}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {classes?.map((cls: any) => {
                    const presentRecords = attendanceByClass?.[cls.id] || [];
                    const count = presentRecords.length;

                    return (
                        <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                                    <p className="text-xs text-slate-500">{cls.time}</p>
                                </div>
                                <Link
                                    href={`/dashboard/class/${cls.id}/attendance?date=${date}`}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100"
                                >
                                    Manage
                                </Link>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="text-2xl font-bold text-green-600">{count}</div>
                                <div className="text-sm text-slate-400 font-medium uppercase">Present Today</div>
                            </div>

                            {count > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {presentRecords.map((rec: any) => (
                                        <span key={rec.id} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-bold flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-green-500"></div>
                                            {rec.students?.full_name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm italic">No attendance marked yet.</p>
                            )}

                        </div>
                    )
                })}

                {!classes?.length && (
                    <p className="text-slate-500">No classes found.</p>
                )}
            </div>
        </div>
    )
}
