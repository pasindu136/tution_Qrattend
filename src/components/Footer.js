import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ================= MOBILE FOOTER (Visible < lg) ================= */}
        <div className="flex flex-col gap-12 lg:hidden mb-12">

          {/* 1. Brand & Socials (Centered) */}
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-white tracking-tight mb-4">
              Tuition<span className="text-blue-500">Mate</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              The #1 Class Management System in Sri Lanka.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-sm font-bold">fb</a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-400 hover:border-blue-400 hover:text-white transition-all text-sm font-bold">tw</a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all text-sm font-bold">in</a>
            </div>
          </div>

          {/* 2. Links (Grid 2 Cols - Left Aligned for clean look) */}
          <div className="grid grid-cols-2 gap-8 border-y border-slate-900 py-10">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 className="text-white font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Updates</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 className="text-white font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>

          {/* 3. Newsletter (Centered) */}
          <div className="text-center">
            <h3 className="text-white font-bold mb-3 text-lg">Stay Updated</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
              Subscribe to get the latest updates and tips for tutors.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors text-center"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* ================= DESKTOP FOOTER (Visible >= lg) ================= */}
        <div className="hidden lg:grid grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand Info */}
          <div className="col-span-1 text-left">
            <div className="text-2xl font-bold text-white tracking-tight mb-4">
              Tuition<span className="text-blue-500">Mate</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The #1 Class Management System in Sri Lanka.
              We help tutors save time, track payments, and grow their classes with technology.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">fb</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors">tw</a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors">in</a>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div className="text-left">
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Updates</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="text-left">
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="col-span-1 text-left">
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe to get the latest updates and tips for tutors.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 TuitionMate. Built with ❤️ in Sri Lanka.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}