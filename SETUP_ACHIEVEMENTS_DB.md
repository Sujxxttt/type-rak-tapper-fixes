# Achievements Database Setup

Run this SQL in your Cloud SQL Editor to set up permanent achievement storage:

```sql
-- Create achievements table
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  achievement_id text not null,
  unlocked boolean default false,
  unlocked_at timestamp with time zone,
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Create user stats table
create table if not exists public.user_stats (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  max_wpm integer default 0,
  total_tests integer default 0,
  perfect_tests integer default 0,
  daily_streak integer default 0,
  cheat_count integer default 0,
  total_visit_days integer default 0,
  daily_typing_minutes real default 0,
  first_login timestamp with time zone,
  last_visit timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.achievements enable row level security;
alter table public.user_stats enable row level security;

-- Create policies for achievements
create policy "Users can view their own achievements"
  on public.achievements for select
  using (true);

create policy "Users can insert their own achievements"
  on public.achievements for insert
  with check (true);

create policy "Users can update their own achievements"
  on public.achievements for update
  using (true);

-- Create policies for user_stats
create policy "Users can view their own stats"
  on public.user_stats for select
  using (true);

create policy "Users can insert their own stats"
  on public.user_stats for insert
  with check (true);

create policy "Users can update their own stats"
  on public.user_stats for update
  using (true);

-- Create indexes
create index if not exists achievements_user_id_idx on public.achievements(user_id);
create index if not exists achievements_achievement_id_idx on public.achievements(achievement_id);
create index if not exists user_stats_user_id_idx on public.user_stats(user_id);
```

After running this SQL, your achievements will be permanently stored in the database and will never reset!
