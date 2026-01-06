import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import SubscriptionManager from "@/components/admin/SubscriptionManager";
import NotificationSender from "@/components/admin/NotificationSender"; // Import
import AdminUserActions from "@/components/admin/AdminUserActions"; // New Import
import SystemStatusButton from "@/components/admin/SystemStatusButton"; // New Import
import { LogOut, Search, Filter, Users, UserCheck, Clock, Shield, ChevronRight, MoreVertical, LayoutGrid, GraduationCap } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Parallel Data Fetching for Dashboard
    const [profilesResult, studentsCountResult, classesCountResult] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("students").select("*", { count: 'exact', head: true }),
        supabase.from("classes").select("*", { count: 'exact', head: true })
    ]);

    const profiles = profilesResult.data || [];
    const totalStudents = studentsCountResult.count || 0;
    const totalClasses = classesCountResult.count || 0;

    // Derived Stats
    const totalTutors = profiles.filter(p => p.role !== 'admin').length;
    const pendingApprovals = profiles.filter(p => !p.is_approved).length;
    const activeTutors = profiles.filter(p => p.is_approved && p.role !== 'admin').length;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <NotificationSender allUsers={profiles} /> {/* Add Notification Sender */}
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">Admin Portal</h1>
                        <p className="text-xs text-slate-500 font-medium">System Overview</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <SystemStatusButton />
                    <form action={signOut}>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <LogOut size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8">

                {/* Greeting */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
                    <p className="text-slate-500">Welcome back, Administrator.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Users size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Total Tutors</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{totalTutors}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <UserCheck size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{activeTutors}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <Clock size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{pendingApprovals}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <GraduationCap size={18} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tutors by name or email..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition font-medium"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-4 px-6 font-bold text-slate-900">User Details</th>
                                    <th className="p-4 font-bold text-slate-900">Role</th>
                                    <th className="p-4 font-bold text-slate-900">Status</th>
                                    <th className="p-4 font-bold text-slate-900">Subscription</th>
                                    <th className="p-4 text-right font-bold text-slate-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-slate-50/80 transition group">
                                        <td className="p-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                                                    {profile.full_name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{profile.full_name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                } `}>
                                                {profile.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {profile.is_approved ? (
                                                <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </span>
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                    Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <SubscriptionManager
                                                userId={profile.id}
                                                initialDate={profile.next_billing_date}
                                                isUnlimited={profile.is_unlimited}
                                                role={profile.role}
                                            />
                                        </td>
                                        <td className="p-4 text-right">
                                            <AdminUserActions profile={profile} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden">
                        {profiles.map((profile) => (
                            <div key={profile.id} className="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg uppercase">
                                            {profile.full_name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{profile.full_name}</h3>
                                            <p className="text-xs text-slate-500 font-sans">{profile.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${profile.is_approved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                        } `}>
                                        {profile.is_approved ? 'Active' : 'Pending'}
                                    </span>
                                </div>

                                <AdminUserActions profile={profile} isMobile={true} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
