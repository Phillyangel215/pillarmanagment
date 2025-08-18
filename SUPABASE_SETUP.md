# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `pillar-management`
   - Database Password: (generate a secure password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the database to launch (2-3 minutes)

## 2. Set up Database Schema

### Option A: Use SQL Editor (Recommended)
1. Go to SQL Editor in your Supabase dashboard
2. Click "User Management Starter" under Community > Quickstarts
3. Click "Run" to create the basic auth tables

### Option B: Manual Schema Setup
Run this SQL in the SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy for profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 3. Set up Storage for Avatar Uploads

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it `avatars`
4. Make it **Public** (so users can view profile photos)
5. Click "Create bucket"

### Set up Storage Policies
Run this SQL in the SQL Editor to allow users to upload their own avatars:

```sql
-- Allow users to upload avatar files
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can view avatar images." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Users can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar." on storage.objects
  for update using (auth.uid()::text = (storage.foldername(name))[1]);
```

## 4. Get API Keys

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secure!)

## 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# For demo mode (set to 1 to enable demo features)
VITE_DEMO=1

# Optional: Service role key (for admin operations - keep this secure!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 6. Test the Connection

Run your development server:

```bash
npm run dev
```

The app should now connect to your Supabase database. You can test authentication by:
1. Opening the app in your browser
2. Trying to sign up with an email
3. Checking the auth.users table in your Supabase dashboard

## 7. Deploy Edge Functions (Optional)

If you want to deploy the serverless functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy functions
supabase functions deploy status
supabase functions deploy notifications
supabase functions deploy provision_user
```

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Double-check your environment variables
2. **CORS errors**: Make sure your domain is added to allowed origins in Supabase settings
3. **RLS errors**: Ensure Row Level Security policies are properly configured
4. **Auth not working**: Check if email confirmation is required in Auth settings

### Demo Mode
If you want to run in demo mode without connecting to Supabase:
- Set `VITE_DEMO=1` in your `.env.local`
- The app will use mock data instead of real database calls

## Next Steps

Once Supabase is configured:
1. Set up your user roles and permissions
2. Create additional database tables for your nonprofit data
3. Configure email templates for auth flows
4. Set up storage buckets if you need file uploads
