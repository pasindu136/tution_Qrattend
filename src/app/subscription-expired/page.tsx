import { signOut } from "@/app/login/actions";
import { LogOut, AlertTriangle, CreditCard, Phone } from "lucide-react";

export default function SubscriptionExpiredPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center">
                <div className="bg-red-50 p-8 flex justify-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 shadow-sm">
                        <AlertTriangle size={40} />
                    </div>
                </div>

                <div className="p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Subscription Expired</h1>
                    <p className="text-slate-500 mb-8">
                        Your monthly service fee is overdue. Your account has been temporarily placed on hold.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                            <CreditCard size={16} className="text-blue-600" />
                            How to Reactivate?
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Please make the monthly payment to the administrator. Your account will be reactivated immediately upon confirmation.
                        </p>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                            <Phone size={16} className="text-green-600" />
                            <span>Contact Admin Hotline: 077-XXXXXXX</span>
                        </div>
                    </div>

                    <form action={signOut}>
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95">
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
