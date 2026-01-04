
import { createClient } from "@/utils/supabase/server";
import { approveUser, deleteUser } from "./actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { LogOut } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                        <p className="text-slate-500">Manage all tutors and gain access to their dashboards.</p>
                    </div>

                    <form action={signOut}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 hover:text-red-600 font-bold text-sm rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition shadow-sm">
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-100">
                            <tr>
                                <th className="p-4 px-6">Name</th>
                                <th className="p-4">Email Address</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {profiles?.map((profile) => (
                                <tr key={profile.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 px-6 font-bold text-slate-900">
                                        {profile.full_name || 'No Name'}
                                    </td>
                                    <td className="p-4 font-mono text-slate-500">
                                        {profile.email}
                                    </td>
                                    <td className="p-4">
                                        {profile.phone || '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {profile.is_approved ? (
                                            <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-amber-500 font-bold text-xs uppercase">
                                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2 items-center">
                                        {!profile.is_approved && (
                                            <form action={approveUser.bind(null, profile.id)}>
                                                <button className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-bold transition">
                                                    Approve
                                                </button>
                                            </form>
                                        )}

                                        <form action={deleteUser.bind(null, profile.id)}>
                                            <button
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition"
                                            >
                                                Suspend
                                            </button>
                                        </form>

                                        {profile.role !== 'admin' && (
                                            <Link
                                                href={`/admin/tutors/${profile.id}`}
                                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                                            >
                                                Manage
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {(!profiles || profiles.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-6 text-xs text-slate-400 text-center max-w-lg mx-auto">
                Note: User passwords are encrypted and cannot be viewed. However, as an Admin, you can access their dashboard directly to manage classes, students, and payments on their behalf.
            </p>
        </div>
    );
}
