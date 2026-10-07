create table if not exists sms_bills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- references auth.users(id) / profiles(id)
  class_id uuid references classes(id) on delete cascade,
  month text not null, -- e.g., '2023-10'
  total_messages integer not null default 0,
  cost_per_message numeric not null default 1.00,
  total_amount numeric not null default 0.00,
  status text not null default 'Unpaid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, class_id, month)
);

-- Enable RLS
alter table sms_bills enable row level security;

-- Create Policies
create policy "Users can view their own sms bills"
  on sms_bills for select
  using ( user_id = auth.uid() );

create policy "Users can insert their own sms bills"
  on sms_bills for insert
  with check ( user_id = auth.uid() );

create policy "Users can update their own sms bills"
  on sms_bills for update
  using ( user_id = auth.uid() );
