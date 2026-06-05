create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) >= 2),
  brand text,
  category text,
  purchase_date date not null,
  price numeric(12, 2) check (price is null or price >= 0),
  warranty_months integer not null default 0 check (warranty_months >= 0),
  warranty_end_date date not null,
  serial_number text,
  notes text,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  original_name text not null,
  storage_path text not null,
  mime_type text,
  size integer,
  document_type text not null default 'other' check (document_type in ('receipt', 'warranty_card', 'manual', 'other')),
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_records (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  description text not null,
  cost numeric(12, 2) check (cost is null or cost >= 0),
  service_provider text,
  next_reminder_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  maintenance_record_id uuid references public.maintenance_records(id) on delete cascade,
  reminder_type text not null default 'warranty' check (reminder_type in ('warranty', 'maintenance')),
  type text not null default 'in_app' check (type in ('in_app', 'email')),
  threshold_days integer,
  title text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  is_read boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

drop index if exists public.notifications_unique_reminder;

create unique index if not exists notifications_unique_warranty_reminder
  on public.notifications (user_id, product_id, type, threshold_days, reminder_type)
  where reminder_type = 'warranty' and product_id is not null and threshold_days is not null;

create unique index if not exists notifications_unique_maintenance_reminder
  on public.notifications (user_id, maintenance_record_id, type, threshold_days, reminder_type)
  where reminder_type = 'maintenance' and maintenance_record_id is not null and threshold_days is not null;

create table if not exists public.notification_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_reminders_enabled boolean not null default true,
  thresholds integer[] not null default array[30, 14, 7],
  weekly_summary_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.documents enable row level security;
alter table public.maintenance_records enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_settings enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.documents to authenticated;
grant select, insert, update, delete on public.maintenance_records to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.notification_settings to authenticated;

drop policy if exists "Users can manage own products" on public.products;
drop policy if exists "Users can manage own documents" on public.documents;
drop policy if exists "Users can manage own maintenance records" on public.maintenance_records;
drop policy if exists "Users can manage own notifications" on public.notifications;
drop policy if exists "Users can manage own notification settings" on public.notification_settings;

create policy "Users can manage own products" on public.products
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own documents" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own maintenance records" on public.maintenance_records
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own notification settings" on public.notification_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('product-documents', 'product-documents', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own product documents" on storage.objects;
drop policy if exists "Users can read own product documents" on storage.objects;
drop policy if exists "Users can delete own product documents" on storage.objects;

create policy "Users can upload own product documents" on storage.objects
  for insert with check (bucket_id = 'product-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own product documents" on storage.objects
  for select using (bucket_id = 'product-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own product documents" on storage.objects
  for delete using (bucket_id = 'product-documents' and auth.uid()::text = (storage.foldername(name))[1]);
