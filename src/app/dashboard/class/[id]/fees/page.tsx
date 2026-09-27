
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FeesManager from "./FeesManager";

export default async function FeesPage({ params: { id }, searchParams }: { params: { id: string }, searchParams: { month?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Fetch Class Details (for fee amount and type)
    const { data: classData } = await supabase
        .from("classes")
        .select("fee_amount, fee_type, teacher_id")
        .eq("id", id)
        .single();

    const isDaily = classData?.fee_type === 'daily';

    // Format Date/Month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const selectedPeriod = isDaily ? (searchParams.date || currentDate) : (searchParams.month || currentMonth);

    // Fetch Students
    const { data: students } = await supabase
        .from("students")
        .select("id, full_name, tute_id, phone")
        .eq("class_id", id)
        .order("full_name");

    // Fetch Payments for Selected Period
    const { data: paymentsData } = await supabase
        .from("payments")
        .select("*")
        .eq("class_id", id)
        .eq("month", selectedPeriod);

    return (
        <FeesManager
            classId={id}
            classFee={classData?.fee_amount || 0}
            feeType={classData?.fee_type || 'monthly'}
            students={students || []}
            initialPeriod={selectedPeriod}
            paymentsData={paymentsData || []}
            ownerId={classData?.teacher_id}
            currentUserId={user.id}
        />
    );
}
