// src/components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 tracking-tight">
          Tuition<span className="text-slate-800">Mate</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          <Link
            href="/admin"
            className="text-sm font-bold text-slate-400 hover:text-slate-800 transition hidden sm:block"
          >
            Admin
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-sm"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}