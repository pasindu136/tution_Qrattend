
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";

export default async function ImpersonateDashboard({ params: { id } }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return redirect("/dashboard");
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Admin Warning Banner */}
            <div className="bg-amber-100 border-b border-amber-200 px-6 py-3 text-amber-800 text-sm font-bold flex justify-between items-center">
                <span>⚠️ You are viewing this dashboard as an Administrator. Be careful when creating or deleting data.</span>
                <a href="/admin" className="underline hover:text-amber-900">Back to Admin Panel</a>
            </div>

            <div className="p-8">
                <DashboardView userId={id} isOwner={false} />
            </div>
        </div>
    )
}
