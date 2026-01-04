
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Grid Pattern (Shared) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      {/* ================= MOBILE HERO (Visible on Small Screens) ================= */}
      <div className="lg:hidden pt-32 pb-16 px-6">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            The #1 Platform for Tutors
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Manage Tuition <br />
            <span className="text-blue-600">Like a Pro.</span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 mb-8 leading-relaxed text-sm max-w-xs">
            No more CR books or messy Excel sheets. Track attendance & fees from your phone.
          </p>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col w-full gap-3 max-w-sm mb-10">
            <Link
              href="/register"
              className="w-full py-4 text-base font-bold text-white bg-blue-600 rounded-xl shadow-xl shadow-blue-600/20 active:scale-95 transition-transform text-center"
            >
              Create Your Class
            </Link>
            <Link
              href="/login"
              className="w-full py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-transform text-center"
            >
              Dashboard Login
            </Link>
          </div>

          {/* Mobile Visual (Simplified Card) */}
          <div className="w-full max-w-sm relative">
            {/* Decoration */}
            <div className="absolute inset-0 bg-blue-600 blur-[60px] opacity-10 -z-10"></div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xl skew-y-3 transform transition-transform">
              {/* Header Row */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">🎓</div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">2026 A/L Physics</p>
                    <p className="text-[10px] text-slate-500">Sunday 8:00 AM</p>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold">ACTIVE</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Students</p>
                  <p className="text-xl font-bold text-slate-900">42</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
                  <p className="text-xl font-bold text-slate-900">84k</p>
                </div>
              </div>
            </div>

            {/* Floating Element */}
            <div className="absolute -right-2 -top-6 bg-white p-2 rounded-lg shadow-lg border border-slate-100 animate-bounce">
              <span className="text-xl">💰</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= DESKTOP HERO (Visible on Large Screens) ================= */}
      <div className="hidden lg:block pt-32 pb-16 lg:pt-40 lg:pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-20 items-center">

          {/* Left Side: Text Content */}
          <div className="text-left z-10">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              The #1 Platform for Tutors
            </div>

            <h1 className="text-7xl font-extrabold leading-[1.1] text-slate-900 mb-6 tracking-tight">
              Manage your Tuition <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Like a Pro.
              </span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              No more CR books or messy Excel sheets. Track attendance, manage fees,
              and organize your students from one simple dashboard.
            </p>

            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-center"
              >
                Create Your Class
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 text-lg font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
              >
                Dashboard Login
              </Link>
            </div>

            {/* Trust Features */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex gap-6 items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">+500</div>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Trusted by <span className="text-slate-900 font-bold">500+ Tutors</span> in Sri Lanka
              </p>
            </div>

          </div>

          {/* Right Side: Advanced Mockup */}
          <div className="relative perspective-1000">
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-visible transform transition duration-500 rotate-y-6 rotate-z-2 hover:rotate-0 z-10">

              {/* Window Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-2 rounded-t-2xl">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                {/* Fake URL Bar */}
                <div className="ml-4 bg-white border border-slate-200 px-3 py-1 rounded-md text-[10px] text-slate-400 flex-1 max-w-[200px]">
                  tuitionmate.lk/dashboard
                </div>
              </div>

              {/* Body */}
              <div className="flex h-[380px] bg-slate-50/30 rounded-b-2xl overflow-hidden">

                {/* Sidebar */}
                <div className="w-16 bg-white border-r border-slate-100 flex flex-col items-center py-6 gap-6 z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-lg shadow-blue-600/20">🏠</div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center text-lg hover:bg-slate-100">👥</div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center text-lg hover:bg-slate-100">💳</div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center text-lg hover:bg-slate-100 mt-auto">⚙️</div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-hidden relative">

                  {/* Top Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800">Dashboard</h3>
                      <p className="text-xs text-slate-500">Welcome back, Sir!</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm"></div>
                  </div>

                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Card 1: Students */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Students</p>
                      <h4 className="text-2xl font-bold text-slate-800">1,254</h4>
                      <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                        ⬆ 12% this month
                      </p>
                      <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-full -mr-4 -mt-4 opacity-50"></div>
                    </div>

                    {/* Card 2: Revenue */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fees Collected</p>
                      <h4 className="text-2xl font-bold text-slate-800">LKR 85k</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        April 2026
                      </p>
                      <div className="absolute right-0 top-0 w-16 h-16 bg-green-50 rounded-full -mr-4 -mt-4 opacity-50"></div>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm h-40 mb-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-slate-700">Income Overview</p>
                      <p className="text-[10px] text-slate-400">Last 6 Months</p>
                    </div>
                    <div className="flex items-end justify-between px-2 gap-3 h-full pb-2">
                      <div className="w-full bg-blue-100 h-[40%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-200 h-[60%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-300 h-[45%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-400 h-[70%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-500 h-[50%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-600 h-[85%] rounded-t-sm relative group">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          LKR 85,000
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* List Items (Student Payments) */}
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Recent Payments</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-[10px] flex items-center justify-center text-purple-600 font-bold">K</div>
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-slate-700">Kasun Perera</p>
                          <p className="text-[9px] text-slate-400">Grade 12 - Maths</p>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">PAID</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Badge (Updated Position) */}
              <div className="absolute -right-8 top-28 bg-white p-3 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 animate-[bounce_3s_infinite] z-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">💵</div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Received</span>
                    <span className="text-sm font-bold text-slate-900 block">LKR 5,000.00</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Back Blob */}
            <div className="absolute inset-0 bg-blue-600 blur-[80px] -z-10 opacity-10 transform translate-y-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
