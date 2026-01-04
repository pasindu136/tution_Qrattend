
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Banknote } from 'lucide-react';
import ClassNav from "@/components/dashboard/ClassNav";

export default async function ClassDetailsPage({ params: { id } }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Fetch Class Details
    const { data: classData, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !classData) {
        return redirect("/dashboard");
    }

    // Fetch Students Count
    const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: 'exact', head: true })
        .eq("class_id", id);

    return (
        <div className="min-h-screen">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{classData.name}</h1>
                    <p className="text-slate-500">{classData.subject} • {classData.day} at {classData.time}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ClassNav classId={id} activeTab="details" />

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Total Students</h3>
                    <p className="text-3xl font-bold text-slate-900">{studentCount || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Class Fee</h3>
                    <p className="text-3xl font-bold text-slate-900">LKR {classData.fee_amount}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Schedule</h3>
                    <p className="text-xl font-bold text-slate-900">{classData.day}</p>
                    <p className="text-slate-500">{classData.time}</p>
                </div>
            </div>

        </div>
    );
}
