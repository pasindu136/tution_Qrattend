
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StudentList from "./StudentList";

export default async function StudentsPage({ params: { id } }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Fetch Students
    const { data: students } = await supabase
        .from("students")
        .select("*")
        .eq("class_id", id)
        .order("joined_at", { ascending: false });

    return (
        <StudentList classId={id} initialStudents={students || []} />
    );
}
