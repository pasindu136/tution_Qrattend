
import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { LogOut, LayoutDashboard, Users, Banknote, Calendar } from "lucide-react";

export default function Sidebar({ user }: { user: any }) {

  const name = user?.full_name || "Tutor"
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col hidden lg:flex border-r border-slate-800 z-50">

      {/* 1. Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="text-2xl font-bold tracking-tight text-white">
          Tuition<span className="text-blue-500">Mate</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Tutor Dashboard</p>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">

        {/* Dashboard Link */}
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white font-medium transition-all group focus:bg-blue-600 focus:text-white active:bg-blue-600 active:text-white">
          <LayoutDashboard size={20} className="group-hover:text-blue-400 group-focus:text-white" />
          Dashboard
        </Link>

        {/* Students Link */}
        <Link href="/dashboard/students" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium group">
          <Users size={20} className="group-hover:text-blue-400" />
          My Students
        </Link>

        {/* Fees Link */}
        <Link href="/dashboard/fees" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium group">
          <Banknote size={20} className="group-hover:text-blue-400" />
          Payments
        </Link>

        {/* Attendance Link */}
        <Link href="/dashboard/attendance" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium group">
          <Calendar size={20} className="group-hover:text-blue-400" />
          Attendance
        </Link>

      </nav>


      {/* 3. User Profile (Bottom) & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-800 rounded-xl mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate w-32">{name}</p>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Pro Plan</p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 rounded-lg transition-colors font-bold">
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>

    </aside>
  );
}