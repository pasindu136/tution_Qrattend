
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addStudent(classId: string, formData: FormData) {
    const supabase = createClient()

    const fullName = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const tuteId = formData.get('tute_id') as string

    const { error } = await supabase
        .from('students')
        .insert({
            class_id: classId,
            full_name: fullName,
            phone: phone,
            tute_id: tuteId
        })

    if (error) {
        console.error('Error adding student:', error)
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/students`)
    revalidatePath(`/dashboard/class/${classId}`)
    return { success: true }
}

export async function deleteStudent(classId: string, studentId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId)
        .eq('class_id', classId) // Extra safety check

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/students`)
    revalidatePath(`/dashboard/class/${classId}`)
    return { success: true }
}

export async function updateStudent(classId: string, studentId: string, formData: FormData) {
    const supabase = createClient()

    const fullName = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const tuteId = formData.get('tute_id') as string

    const { error } = await supabase
        .from('students')
        .update({
            full_name: fullName,
            phone: phone,
            tute_id: tuteId
        })
        .eq('id', studentId)
        .eq('class_id', classId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath(`/dashboard/class/${classId}/students`)
    return { success: true }
}
