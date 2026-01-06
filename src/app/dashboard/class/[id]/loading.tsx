import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-2xl shadow-lg border border-blue-50">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-900">Loading Class...</h3>
                    <p className="text-sm text-slate-500">Please wait while we fetch the details.</p>
                </div>
            </div>
        </div>
    );
}
