import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardView({ userId, isOwner = true }: { userId: string, isOwner?: boolean }) {
    const supabase = createClient();

    // 1. Fetch Classes and Profile in Parallel
    const [classesResult, profileResult] = await Promise.all([
        supabase
            .from("classes")
            .select("*, students(count)")
            .eq("teacher_id", userId)
            .order("created_at", { ascending: false }),
        supabase
            .from("profiles")
            .select("full_name, next_billing_date, is_unlimited")
            .eq("id", userId)
            .single()
    ]);

    const classes = classesResult.data;
    const profile = profileResult.data;

    // 2. Fetch Expenses (Depends on classes)
    const classIds = classes?.map((c: any) => c.id) || [];
    const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, date")
        .in("class_id", classIds);

    // Calculate Financials
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyGrossRevenue = classes?.reduce((acc: number, cls: any) => acc + (cls.fee_amount * (cls.students?.[0]?.count || 0)), 0) || 0;

    const monthlyExpenses = expenses
        ?.filter((exp: any) => {
            const d = new Date(exp.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum: number, exp: any) => sum + exp.amount, 0) || 0;

    const netRevenue = monthlyGrossRevenue - monthlyExpenses;

    // Greeting logic
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if (hour >= 12) greeting = "Good Afternoon";
    if (hour >= 17) greeting = "Good Evening";

    // Subscription Check
    const nextBilling = profile?.next_billing_date ? new Date(profile.next_billing_date) : null;
    const daysRemaining = nextBilling ? Math.ceil((nextBilling.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    const showPaymentWarning = daysRemaining <= 5 && isOwner && !profile?.is_unlimited;

    return (
        <DashboardClient
            classes={classes || []}
            profile={profile}
            netRevenue={netRevenue}
            monthlyGrossRevenue={monthlyGrossRevenue}
            monthlyExpenses={monthlyExpenses}
            userId={userId}
            isOwner={isOwner}
            greeting={greeting}
            showPaymentWarning={!!showPaymentWarning}
            daysRemaining={daysRemaining}
            nextBillingStr={nextBilling?.toLocaleDateString() || null}
        />
    );
}
