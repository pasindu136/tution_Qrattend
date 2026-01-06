export const translations = {
    en: {
        dashboard: {
            welcome: "Welcome back,",
            total_students: "Total Students",
            active_classes: "Active Classes",
            net_income: "Net Monthly Income",
            quick_actions: "Quick Actions",
            create_class: "Create Class",
            add_student: "Add Student",
            mark_attendance: "Mark Attendance",
            my_classes: "My Classes",
            no_classes: "No classes yet",
            get_started: "Get started by creating your first class to manage students.",
            view_details: "View Details",
            students: "Students",
            schedule: "Schedule",
            fees: "Fees"
        },
        nav: {
            home: "Home",
            students: "Students",
            attendance: "Attendance",
            payments: "Payments",
            profile: "Profile",
            support_contact: "Support & Contact",
            need_help: "Need Help?",
            chat_whatsapp: "Chat on WhatsApp",
            instant_support: "Instant Support",
            sign_out: "Sign Out",
            close: "Close",
            pro_plan: "Pro Plan"
        },
        common: {
            loading: "Loading...",
            search: "Search...",
            cancel: "Cancel",
            save: "Save"
        },
        class_details: {
            details: "Details",
            students: "Students",
            attendance: "Attendance",
            fees: "Fees",
            settings: "Settings",
            add_student: "Add Student",
            mark_attendance: "Mark Attendance",
            export: "Export",
            search_student: "Search student...",
            payment_history: "Payment History",
            record_payment: "Record Payment",
            delete_class: "Delete Class",
            delete_warning: "Are you sure? This cannot be undone.",
            class_fee: "Class Fee",
            schedule: "Schedule",
            expenses: "Expenses"
        },
        modals: {
            create_class: "Create New Class",
            edit_class: "Edit Class",
            delete_class: "Delete Class",
            confirm_delete: "Are you sure you want to delete this?",
            admin_warning: "ADMIN WARNING",
            admin_warning_desc: "You are creating this class for another user. Are you sure?",
            update_class: "Update Class",
            create: "Create Class",
            cancel: "Cancel",
            close: "Close"
        },
        forms: {
            class_name: "Class Name",
            subject: "Subject",
            fee: "Fee (LKR)",
            day: "Day",
            time: "Time",
            placeholder_name: "e.g. 2026 A/L Physics",
            placeholder_subject: "e.g. Physics",
            placeholder_fee: "2500"
        }
    },
    si: {
        dashboard: {
            welcome: "ආයුබෝවන්,",
            total_students: "මුළු සිසුන්",
            active_classes: "සක්‍රීය පන්ති",
            net_income: "මාසික ආදායම",
            quick_actions: "කෙටි ක්‍රියා",
            create_class: "නව පන්තියක්",
            add_student: "සිසුවෙක් එකතු කරන්න",
            mark_attendance: "පැමිණීම සලකුණු කරන්න",
            my_classes: "මගේ පන්ති",
            no_classes: "තවම පන්ති කිසිවක් නැත",
            get_started: "ඔබේ පළමු පන්තිය නිර්මාණය කිරීමෙන් ආරම්භ කරන්න.",
            view_details: "විස්තර බලන්න",
            students: "සිසුන්",
            schedule: "කාලසටහන",
            fees: "ගාස්තු"
        },
        nav: {
            home: "මුල් පිටුව",
            students: "සිසුන්",
            attendance: "පැමිණීම",
            payments: "ගෙවීම්",
            profile: "පැතිකඩ",
            support_contact: "සහාය සහ සම්බන්ධතා",
            need_help: "උදව් අවශ්‍යද?",
            chat_whatsapp: "WhatsApp හරහා කතා කරන්න",
            instant_support: "ක්ෂණික සහාය",
            sign_out: "ඉවත් වන්න",
            close: "වසන්න",
            pro_plan: "Pro සැලැස්ම"
        },
        common: {
            loading: "රැඳී සිටින්න...",
            search: "සොයන්න...",
            cancel: "අවලංගු කරන්න",
            save: "සුරකින්න"
        },
        class_details: {
            details: "විස්තර",
            students: "සිසුන්",
            attendance: "පැමිණීම",
            fees: "ගාස්තු",
            settings: "සකසීම්",
            add_student: "සිසුවෙක් එකතු කරන්න",
            mark_attendance: "පැමිණීම Mark කරන්න",
            export: "වාර්තාව ගන්න",
            search_student: "සිසුවා සොයන්න...",
            payment_history: "ගෙවීම් ඉතිහාසය",
            record_payment: "ගෙවීමක් එකතු කරන්න",
            delete_class: "පන්තිය ඉවත් කරන්න",
            delete_warning: "ඔබට විශ්වාසද? මෙය නැවත හැරවිය නොහැක.",
            class_fee: "පන්ති ගාස්තුව",
            schedule: "කාලසටහන",
            expenses: "වියදම්"
        },
        modals: {
            create_class: "නව පන්තියක් සාදන්න",
            edit_class: "පන්තිය සංස්කරණය",
            delete_class: "පන්තිය මකන්න",
            confirm_delete: "ඔබට මෙය මැකීමට අවශ්‍ය බව විශ්වාසද?",
            admin_warning: "Admin අවවාදයයි",
            admin_warning_desc: "ඔබ වෙනත් අයෙකු සඳහා පන්තියක් සාදයි. ඉදිරියට යන්නද?",
            update_class: "යාවත්කාලීන කරන්න",
            create: "පන්තිය සාදන්න",
            cancel: "අවලංගු කරන්න",
            close: "වසන්න"
        },
        forms: {
            class_name: "පන්තියේ නම",
            subject: "විෂය",
            fee: "ගාස්තුව (LKR)",
            day: "දිනය",
            time: "වේලාව",
            placeholder_name: "උදා: 2026 A/L Physics",
            placeholder_subject: "උදා: Physics",
            placeholder_fee: "2500"
        }
    }
};

export type Language = 'en' | 'si';
export type TranslationState = typeof translations.en;
