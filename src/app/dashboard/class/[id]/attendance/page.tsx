
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AttendanceManager from "./AttendanceManager";

export default async function AttendancePage({ params: { id }, searchParams }: { params: { id: string }, searchParams: { date?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Format Date (Default to today)
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = searchParams.date || today;

    // Fetch Students
    const { data: students } = await supabase
        .from("students")
        .select("id, full_name, tute_id, phone")
        .eq("class_id", id)
        .order("full_name");

    // Fetch Attendance for Selected Date
    const { data: attendanceData } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("class_id", id)
        .eq("date", selectedDate);

    // Fetch Class Owner (for Admin Check)
    const { data: classData } = await supabase
        .from("classes")
        .select("teacher_id")
        .eq("id", id)
        .single();

    return (
        <AttendanceManager
            classId={id}
            students={students || []}
            initialDate={selectedDate}
            attendanceData={attendanceData || []}
            ownerId={classData?.teacher_id}
            currentUserId={user.id}
        />
    );
}
