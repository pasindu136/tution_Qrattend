
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Banknote, TrendingDown, Wallet } from "lucide-react";

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

    // 3. Get Expenses for current Month
    const startOfMonth = `${currentMonth}-01`;
    // Calculate start of next month for filtering
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfNextMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`;

    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .in('class_id', classIds)
        .gte('date', startOfMonth)
        .lt('date', startOfNextMonth);

    // Calculate Totals
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, e) => sum + (Number(e.amount) || 0), 0) || 0;
    const netIncome = totalRevenue - totalExpenses;

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Financial Overview ({currentMonth})</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Total Revenue</p>
                        <h2 className="text-2xl font-bold text-slate-900">LKR {totalRevenue.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Expenses Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Total Expenses</p>
                        <h2 className="text-2xl font-bold text-slate-900">LKR {totalExpenses.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Net Income Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">Net Income</p>
                        <h2 className="text-3xl font-bold text-blue-600">LKR {netIncome.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-700">Recent Transactions</div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <table className="w-full text-left text-sm text-slate-600">
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

                {/* Mobile Card List View */}
                <div className="lg:hidden flex flex-col divide-y divide-slate-100">
                    {payments?.map((payment: any) => (
                        <div key={payment.id} className="p-4 hover:bg-slate-50 transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{payment.students?.full_name}</h3>
                                <p className="font-bold text-green-600">+ LKR {payment.amount}</p>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">
                                    {payment.classes?.name}
                                </span>
                                <span className="text-slate-400 font-mono">
                                    {new Date(payment.paid_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {(!payments || payments.length === 0) && (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            No payments recorded for this month yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
