-- Add indexes to improve query performance

-- Classes: Frequently queried by teacher_id
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
-- Also helpful for sorting
CREATE INDEX IF NOT EXISTS idx_classes_created_at ON classes(created_at DESC);

-- Students: Frequently queried by class_id
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- Attendance: Frequently queried by class_id and date
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_composite ON attendance(class_id, date);

-- Payments: Frequently queried by class_id and month
CREATE INDEX IF NOT EXISTS idx_payments_class_id ON payments(class_id);
CREATE INDEX IF NOT EXISTS idx_payments_month ON payments(month);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_composite ON payments(class_id, month);

-- Expenses: Frequently queried by class_id and date ranges
CREATE INDEX IF NOT EXISTS idx_expenses_class_id ON expenses(class_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Profiles: Lookup by ID is already primary key, but if we query by email or other fields:
-- CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
