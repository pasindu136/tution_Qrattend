'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExpense(classId: string, description: string, amount: number, date: Date) {
    const supabase = createClient();

    const { error } = await supabase
        .from('expenses')
        .insert({
            class_id: classId,
            description,
            amount,
            date: date.toISOString(),
        });

    if (error) {
        console.error('Error adding expense:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/class/${classId}/expenses`);
    return { success: true };
}

export async function deleteExpense(classId: string, expenseId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

    if (error) {
        console.error('Error deleting expense:', error);
        return { success: false, error: error.message };
    }

    revalidatePath(`/dashboard/class/${classId}/expenses`);
    return { success: true };
}
