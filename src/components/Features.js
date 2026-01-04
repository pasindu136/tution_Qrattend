export default function Features() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need</h2>
              <p className="text-slate-500 mt-2">To run your class efficiently</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📱</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Mobile First</h3>
                  <p className="text-slate-600 leading-relaxed">
                      Mark attendance directly from the classroom using your phone. Fast, simple, and optimized for mobile.
                  </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">💸</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Fee Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">
                      Track who paid and who's pending with a single click. Never miss a payment again.
                  </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Reports</h3>
                  <p className="text-slate-600 leading-relaxed">
                      Generate monthly income reports and student lists automatically. Export as PDF in seconds.
                  </p>
              </div>
          </div>
      </div>
    </section>
  );
}