
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardView from "@/components/dashboard/DashboardView";

export default async function DashboardHome() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    return <DashboardView userId={user.id} />
}
