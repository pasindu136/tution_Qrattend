import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExpensesManager from "./ExpensesManager";

export default async function ExpensesPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch expenses
    const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('class_id', params.id)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching expenses:', error);
    }

    return (
        <ExpensesManager
            classId={params.id}
            initialExpenses={expenses || []}
        />
    );
}
