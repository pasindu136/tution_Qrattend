import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PullToRefresh from "@/components/ui/PullToRefresh";
import NotificationListener from "@/components/dashboard/NotificationListener";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch Profile Details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.is_approved) {
    redirect("/pending");
  }

  // Check Subscription (Skip for Admin & Unlimited)
  if (profile.role !== 'admin' && !profile.is_unlimited && profile.next_billing_date) {
    const nextBilling = new Date(profile.next_billing_date);
    if (new Date() > nextBilling) {
      redirect("/subscription-expired");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <NotificationListener userId={user.id} />

      {/* 1. Sidebar (Fixed Left - Desktop Only) */}
      <Sidebar user={profile} />

      {/* 2. Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto mb-20 lg:mb-0">
        <PullToRefresh>
          {children}
        </PullToRefresh>
      </main>

      {/* 3. Mobile Navigation (Fixed Bottom - Mobile Only) */}
      <MobileNav user={profile} />

    </div>
  );
}