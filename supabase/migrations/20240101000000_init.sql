-- =============================================
-- Extensions
-- =============================================
create extension if not exists "uuid-ossp";

-- =============================================
-- Profiles
-- =============================================
create table public.profiles (
  id             uuid references auth.users on delete cascade primary key,
  nickname       text,
  email          text,
  avatar_url     text,
  provider       text,
  role           text not null default 'user' check (role in ('user', 'admin')),
  plan           text not null default 'free' check (plan in ('free', 'premium')),
  point_balance  int not null default 0 check (point_balance >= 0),
  is_ad_removed  boolean not null default false,
  created_at     timestamptz not null default now(),
  last_login_at  timestamptz
);

alter table public.profiles enable row level security;

create policy "본인 프로필 조회" on public.profiles
  for select using (auth.uid() = id);

create policy "본인 프로필 수정" on public.profiles
  for update using (auth.uid() = id);

create policy "관리자 전체 조회" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- Draws
-- =============================================
create table public.draws (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles on delete cascade not null,
  numbers      int[] not null,
  mode         text not null check (mode in ('random', 'manual', 'analysis', 'dream')),
  meta         jsonb,
  is_favorited boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.draws enable row level security;

create policy "본인 번호만 조회" on public.draws
  for select using (auth.uid() = user_id);

create policy "본인 번호만 생성" on public.draws
  for insert with check (auth.uid() = user_id);

create policy "본인 번호만 수정" on public.draws
  for update using (auth.uid() = user_id);

create index draws_user_id_idx on public.draws(user_id);
create index draws_created_at_idx on public.draws(created_at desc);

-- =============================================
-- Point Transactions
-- =============================================
create table public.point_transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles on delete cascade not null,
  type          text not null,
  amount        int not null,
  balance_after int not null,
  ref_id        text,
  created_at    timestamptz not null default now()
);

alter table public.point_transactions enable row level security;

create policy "본인 포인트 내역 조회" on public.point_transactions
  for select using (auth.uid() = user_id);

create index point_tx_user_id_idx on public.point_transactions(user_id);

-- =============================================
-- Winning Numbers
-- =============================================
create table public.winning_numbers (
  id               uuid primary key default uuid_generate_v4(),
  draw_no          int unique not null,
  numbers          int[] not null,
  bonus            int not null,
  prize_1st        bigint,
  winner_count_1st int,
  draw_date        date not null,
  created_at       timestamptz not null default now()
);

alter table public.winning_numbers enable row level security;

create policy "당첨번호 전체 공개" on public.winning_numbers
  for select using (true);

create index winning_draw_no_idx on public.winning_numbers(draw_no desc);

-- =============================================
-- Events
-- =============================================
create table public.events (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  type         text not null check (type in ('point_reward', 'draw_bonus', 'ad_free')),
  reward_point int not null default 0,
  start_at     timestamptz not null,
  end_at       timestamptz not null,
  is_active    boolean not null default true,
  created_by   uuid references public.profiles not null,
  created_at   timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "이벤트 공개 조회" on public.events
  for select using (is_active = true);

create policy "관리자 이벤트 관리" on public.events
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- Event Participants
-- =============================================
create table public.event_participants (
  id        uuid primary key default uuid_generate_v4(),
  event_id  uuid references public.events on delete cascade not null,
  user_id   uuid references public.profiles on delete cascade not null,
  joined_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_participants enable row level security;

create policy "본인 참여 이력 조회" on public.event_participants
  for select using (auth.uid() = user_id);

-- =============================================
-- Dream Logs
-- =============================================
create table public.dream_logs (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles on delete cascade not null,
  dream_text   text not null,
  keywords     text[] not null default '{}',
  numbers      int[] not null,
  ai_reasoning text,
  draw_id      uuid references public.draws,
  created_at   timestamptz not null default now()
);

alter table public.dream_logs enable row level security;

create policy "본인 꿈 해몽 조회" on public.dream_logs
  for select using (auth.uid() = user_id);

-- =============================================
-- Daily Stats
-- =============================================
create table public.daily_stats (
  date         date primary key,
  dau          int not null default 0,
  new_users    int not null default 0,
  total_draws  int not null default 0,
  ad_revenue   numeric(12,2) not null default 0,
  point_spent  bigint not null default 0
);

alter table public.daily_stats enable row level security;

create policy "관리자 통계 조회" on public.daily_stats
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- RPC: 포인트 차감
-- =============================================
create or replace function public.deduct_points(
  p_user_id uuid,
  p_amount   int,
  p_type     text,
  p_ref_id   text default null
) returns void language plpgsql security definer as $$
declare
  v_balance int;
begin
  select point_balance into v_balance from public.profiles where id = p_user_id for update;
  if v_balance < p_amount then
    raise exception '포인트 부족';
  end if;
  update public.profiles set point_balance = point_balance - p_amount where id = p_user_id;
  insert into public.point_transactions(user_id, type, amount, balance_after, ref_id)
    values (p_user_id, p_type, -p_amount, v_balance - p_amount, p_ref_id);
end;
$$;

-- =============================================
-- RPC: 포인트 적립
-- =============================================
create or replace function public.add_points(
  p_user_id uuid,
  p_amount   int,
  p_type     text,
  p_ref_id   text default null
) returns void language plpgsql security definer as $$
declare
  v_balance int;
begin
  update public.profiles set point_balance = point_balance + p_amount
    where id = p_user_id returning point_balance into v_balance;
  insert into public.point_transactions(user_id, type, amount, balance_after, ref_id)
    values (p_user_id, p_type, p_amount, v_balance, p_ref_id);
end;
$$;

-- =============================================
-- Trigger: 신규 유저 프로필 자동 생성
-- =============================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, email, nickname, avatar_url, provider, point_balance)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_app_meta_data->>'provider',
    50  -- 회원가입 보너스 50P
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
