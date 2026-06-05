alter table public.maintenance_records
  add column if not exists next_reminder_date date;

alter table public.notifications
  add column if not exists maintenance_record_id uuid references public.maintenance_records(id) on delete cascade,
  add column if not exists reminder_type text not null default 'warranty';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'notifications_reminder_type_check'
  ) then
    alter table public.notifications
      add constraint notifications_reminder_type_check
      check (reminder_type in ('warranty', 'maintenance'));
  end if;
end $$;

update public.notifications
set reminder_type = 'warranty'
where reminder_type is null;

drop index if exists public.notifications_unique_reminder;

create unique index if not exists notifications_unique_warranty_reminder
  on public.notifications (user_id, product_id, type, threshold_days, reminder_type)
  where reminder_type = 'warranty' and product_id is not null and threshold_days is not null;

create unique index if not exists notifications_unique_maintenance_reminder
  on public.notifications (user_id, maintenance_record_id, type, threshold_days, reminder_type)
  where reminder_type = 'maintenance' and maintenance_record_id is not null and threshold_days is not null;
