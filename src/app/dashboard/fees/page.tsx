
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Banknote } from "lucide-react";

export default async function AllFeesPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // 1. Get User's Classes
    const { data: classes } = await supabase.from('classes').select('id, name, fee_amount').eq('teacher_id', user.id)
    const classIds = classes?.map(c => c.id) || []

    // 2. Get Payments for current Month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { data: payments } = await supabase
        .from('payments')
        .select('*, students(full_name), classes(name)')
        .in('class_id', classIds)
        .eq('month', currentMonth)
        .order('paid_at', { ascending: false });

    // Calculate Totals
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Payments Overview ({currentMonth})</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Total Collected This Month</p>
                        <h2 className="text-3xl font-bold text-slate-900">LKR {totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-700">Recent Transactions</div>
                <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Student</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments?.map((payment: any) => (
                            <tr key={payment.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-bold text-slate-900">
                                    {payment.students?.full_name}
                                </td>
                                <td className="p-4">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                        {payment.classes?.name}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 font-mono text-xs">
                                    {new Date(payment.paid_at).toLocaleString()}
                                </td>
                                <td className="p-4 text-right font-bold text-green-600">
                                    + LKR {payment.amount}
                                </td>
                            </tr>
                        ))}
                        {(!payments || payments.length === 0) && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">
                                    No payments recorded for this month yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
