-- Forms Platform Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the forms platform

-- Create form templates table
create table if not exists public.form_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  version int not null default 1,
  schema jsonb not null,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create form responses table
create table if not exists public.form_responses (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.form_templates(id) on delete cascade,
  status text not null default 'submitted', -- submitted | draft | signed | archived
  data jsonb not null,
  signatures jsonb, -- [{by:'user|client|board', when:ts, ip:string, user_id}]
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create form uploads table
create table if not exists public.form_uploads (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.form_responses(id) on delete cascade,
  field_id text not null,
  filename text not null,
  content_type text not null,
  size bigint not null,
  storage_path text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.form_templates enable row level security;
alter table public.form_responses enable row level security;
alter table public.form_uploads enable row level security;

-- Helper function: check role from JWT app_metadata.roles
create or replace function public.has_role(role text) 
returns boolean 
language sql 
stable 
as $$
  select coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' -> 'roles') @> to_jsonb(array[role]),
    false
  );
$$;

-- Form Templates Policies
-- Templates are readable by staff, creatable by SUPER_ADMIN/ADMIN
drop policy if exists tpl_read on public.form_templates;
create policy tpl_read on public.form_templates 
  for select using (
    public.has_role('SUPER_ADMIN') OR 
    public.has_role('ADMIN') OR 
    public.has_role('PROGRAM_DIRECTOR') OR 
    public.has_role('BOARD_SECRETARY') OR 
    public.has_role('HR_MANAGER') OR 
    public.has_role('DEVELOPMENT_DIRECTOR')
  );

drop policy if exists tpl_insert on public.form_templates;
create policy tpl_insert on public.form_templates 
  for insert with check (
    public.has_role('SUPER_ADMIN') OR 
    public.has_role('ADMIN')
  );

drop policy if exists tpl_update on public.form_templates;
create policy tpl_update on public.form_templates 
  for update using (
    public.has_role('SUPER_ADMIN') OR 
    public.has_role('ADMIN')
  );

-- Form Responses Policies
-- Responses visible to creators and to privileged roles per domain
drop policy if exists resp_read on public.form_responses;
create policy resp_read on public.form_responses 
  for select using (
    created_by = auth.uid() OR
    public.has_role('SUPER_ADMIN') OR 
    public.has_role('ADMIN') OR 
    public.has_role('HR_MANAGER') OR 
    public.has_role('PROGRAM_DIRECTOR') OR 
    public.has_role('BOARD_SECRETARY')
  );

drop policy if exists resp_insert on public.form_responses;
create policy resp_insert on public.form_responses 
  for insert with check (auth.uid() is not null);

drop policy if exists resp_update on public.form_responses;
create policy resp_update on public.form_responses 
  for update using (
    created_by = auth.uid() OR
    public.has_role('SUPER_ADMIN') OR 
    public.has_role('ADMIN')
  );

-- Form Uploads Policies
drop policy if exists upload_read on public.form_uploads;
create policy upload_read on public.form_uploads 
  for select using (
    exists (
      select 1 from public.form_responses 
      where id = form_uploads.response_id 
      and (
        created_by = auth.uid() OR
        public.has_role('SUPER_ADMIN') OR 
        public.has_role('ADMIN') OR 
        public.has_role('HR_MANAGER') OR 
        public.has_role('PROGRAM_DIRECTOR')
      )
    )
  );

drop policy if exists upload_insert on public.form_uploads;
create policy upload_insert on public.form_uploads 
  for insert with check (
    exists (
      select 1 from public.form_responses 
      where id = form_uploads.response_id 
      and created_by = auth.uid()
    )
  );

-- Create storage buckets (run these commands in the Supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('forms_uploads', 'forms_uploads', false);

-- Storage policies for form uploads
-- create policy "Authenticated users can upload form files" on storage.objects
--   for insert with check (bucket_id = 'forms_uploads' and auth.role() = 'authenticated');

-- create policy "Users can view their own uploads" on storage.objects
--   for select using (bucket_id = 'forms_uploads' and auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
create index if not exists idx_form_templates_slug on public.form_templates(slug);
create index if not exists idx_form_responses_template_id on public.form_responses(template_id);
create index if not exists idx_form_responses_created_by on public.form_responses(created_by);
create index if not exists idx_form_responses_status on public.form_responses(status);
create index if not exists idx_form_uploads_response_id on public.form_uploads(response_id);

-- Updated at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_form_templates_updated_at on public.form_templates;
create trigger update_form_templates_updated_at
  before update on public.form_templates
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_form_responses_updated_at on public.form_responses;
create trigger update_form_responses_updated_at
  before update on public.form_responses
  for each row execute function public.update_updated_at_column();

