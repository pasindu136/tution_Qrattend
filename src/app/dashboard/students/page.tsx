
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, GraduationCap } from "lucide-react";

export default async function AllStudentsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Fetch All Students with their Class Details
    // We join 'students' with 'classes' and filter where classes.teacher_id = user.id
    const { data: students, error } = await supabase
        .from("students")
        .select("*, classes(name, subject)")
        .eq("classes.teacher_id", user.id) // This requires filtering on joined table which Supabase supports if set up, or we might need to filter manually or change query.
    // Actually Supabase inner join filtering:
    // .not("classes", "is", null) // if we use inner join

    // Let's try to query students where class_id is in list of user's classes
    // 1. Get User's Classes
    const { data: classes } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id)
    const classIds = classes?.map(c => c.id) || []

    // 2. Get Students in those classes
    const { data: allStudents } = await supabase
        .from('students')
        .select('*, classes(name, subject)')
        .in('class_id', classIds)
        .order('full_name');

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-slate-900">All Students</h1>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4 px-6">Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allStudents?.map((student: any) => (
                            <tr key={student.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 px-6 font-bold text-slate-900">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                            {student.full_name?.charAt(0)}
                                        </div>
                                        {student.full_name}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-slate-900">{student.phone}</span>
                                        <span className="text-xs text-slate-400">{student.email || 'No Email'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                        {student.classes?.name}
                                    </span>
                                </td>
                                <td className="p-4 text-blue-600 font-bold hover:underline">
                                    <Link href={`/dashboard/class/${student.class_id}/students`}>
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!allStudents || allStudents.length === 0) && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">
                                    No students found. Add students inside your classes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List View */}
            <div className="lg:hidden flex flex-col gap-4">
                {allStudents?.map((student: any) => (
                    <div key={student.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {student.full_name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{student.full_name}</h3>
                                    <p className="text-xs text-slate-500">{student.email || 'No Email'}</p>
                                </div>
                            </div>
                            <Link href={`/dashboard/class/${student.class_id}/students`} className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                                <ArrowLeft className="rotate-180" size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</p>
                                <p className="text-sm font-bold text-slate-700">{student.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</p>
                                <p className="text-sm font-bold text-blue-600 truncate">{student.classes?.name}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {(!allStudents || allStudents.length === 0) && (
                    <div className="text-center p-8 text-slate-400 bg-white rounded-2xl border border-slate-200">
                        No students found.
                    </div>
                )}
            </div>
        </div>
    )
}
