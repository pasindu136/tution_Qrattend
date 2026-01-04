-- Create Expenses Table
create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id) on delete cascade not null,
  description text not null,
  amount numeric not null,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table expenses enable row level security;

-- Create Policies
create policy "Users can view expenses for their classes"
  on expenses for select
  using (
    exists (
      select 1 from classes
      where classes.id = expenses.class_id
      and classes.user_id = auth.uid()
    )
  );

create policy "Users can insert expenses for their classes"
  on expenses for insert
  with check (
    exists (
      select 1 from classes
      where classes.id = expenses.class_id
      and classes.user_id = auth.uid()
    )
  );

create policy "Users can delete expenses for their classes"
  on expenses for delete
  using (
    exists (
      select 1 from classes
      where classes.id = expenses.class_id
      and classes.user_id = auth.uid()
    )
  );
