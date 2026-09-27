-- Supabase Schema Setup for Tuition Management SaaS

-- 1. Create a table for Teachers (Public Profile linked to Auth)
create table public.teachers (
  id uuid references auth.users not null primary key,
  email text not null,
  name text not null,
  subject text,
  role text default 'teacher' check (role in ('teacher', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for Teachers
alter table public.teachers enable row level security;

-- Teachers can read their own profile
create policy "Teachers can view own profile."
  on teachers for select
  using ( auth.uid() = id );

-- Admins can read all profiles
create policy "Admins can view all profiles."
  on teachers for select
  using ( 
    (select role from teachers where id = auth.uid()) = 'admin'
  );


-- 2. Create a table for Students
create table public.students (
  id text primary key,
  teacher_id uuid references public.teachers(id) not null,
  name text not null,
  phone text not null,
  email text,
  class_name text not null,
  card_type text not null check (card_type in ('Paid', 'Free Card')),
  paid_status text not null check (paid_status in ('Paid', 'Unpaid')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for Students
alter table public.students enable row level security;

-- Teachers can perform all actions on their own students
create policy "Teachers can manage their own students."
  on students for all
  using ( auth.uid() = teacher_id );


-- 3. Create a table for Attendance Logs
create table public.attendance_logs (
  id text primary key,
  teacher_id uuid references public.teachers(id) not null,
  student_id text references public.students(id) not null,
  status text not null check (status in ('Granted', 'Denied')),
  message text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security for Attendance Logs
alter table public.attendance_logs enable row level security;

-- Teachers can perform all actions on their own attendance logs
create policy "Teachers can manage their own attendance logs."
  on attendance_logs for all
  using ( auth.uid() = teacher_id );


-- 4. Automatically create a Teacher profile when a new Auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.teachers (id, email, name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'teacher')
  );
  return new;
end;
$$;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Dummy Insert for Super Admin Setup
-- (You would normally sign up an admin via the dashboard or API, then update the role here)
-- update public.teachers set role = 'admin' where email = 'admin@edu.com';
