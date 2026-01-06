import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ClassDetailsClient from "./ClassDetailsClient";

export default async function ClassDetailsPage({ params: { id } }: { params: { id: string } }) {
    const supabase = createClient();
    // Fetch Current User & Profile
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return redirect("/login");

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    // Fetch Class Details
    const { data: classData, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !classData) {
        return redirect("/dashboard");
    }

    const isOwner = currentUser.id === classData.teacher_id;

    // Fetch Students Count
    const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: 'exact', head: true })
        .eq("class_id", id);

    return (
        <ClassDetailsClient
            classData={classData}
            studentCount={studentCount || 0}
            isAdmin={isAdmin}
            isOwner={isOwner}
            classId={id}
        />
    );
}
