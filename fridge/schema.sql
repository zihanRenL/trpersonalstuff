-- =========================================================
-- 冰箱食材过期提醒 — Supabase 建表脚本
-- 用法：Supabase 控制台 → SQL Editor → 新建 query → 整个文件贴进去 → Run
-- 可以重复运行，不会把已有数据洗掉。
-- =========================================================

-- ---------------------------------------------------------
-- 1. 食材默认信息表（全局共享）
--    每种食材的默认保质期。改这里只影响之后新加入的库存记录。
-- ---------------------------------------------------------
create table if not exists public.food_defaults (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  default_days integer not null default 7
                 check (default_days >= 0 and default_days <= 3650),
  storage      text not null default '冷藏'
                 check (storage in ('冷藏', '冷冻', '常温')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2. 我的库存表（每一份具体食材一行）
--    剩余天数不落库，前端按 shelf_days − (今天 − added_on) 现算，
--    这样不用定时任务，任何时候打开都是准的。
-- ---------------------------------------------------------
create table if not exists public.inventory_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid()
                 references auth.users (id) on delete cascade,
  food_name    text not null,
  added_on     date not null default current_date,
  shelf_days   integer not null default 7
                 check (shelf_days >= 0 and shelf_days <= 3650),
  status       text not null default '在库'
                 check (status in ('在库', '已处理')),
  created_at   timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists inventory_items_user_status_idx
  on public.inventory_items (user_id, status, added_on);

-- ---------------------------------------------------------
-- 3. updated_at 自动维护
-- ---------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists food_defaults_touch on public.food_defaults;
create trigger food_defaults_touch
  before update on public.food_defaults
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------
-- 4. 表级授权（GRANT）
--    新版 Supabase 项目不再自动给 public schema 下新建的表授予
--    anon / authenticated 权限，所以用 SQL 建的表必须显式 GRANT，
--    否则前端会报 "permission denied for table food_defaults"。
--
--    只给 authenticated，不给 anon —— 没登录的人连表都碰不到。
--    GRANT 只是"能不能碰这张表"，"能碰到哪几行"由下面的 RLS 决定，
--    两层都要有。
-- ---------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.food_defaults   to authenticated;
grant select, insert, update, delete on public.inventory_items to authenticated;

-- ---------------------------------------------------------
-- 5. 行级安全（RLS）
--    这是真正的门禁：没登录的人拿着 publishable key 也读不到任何东西。
-- ---------------------------------------------------------
alter table public.food_defaults  enable row level security;
alter table public.inventory_items enable row level security;

-- 食材默认表是全局共享的，登录用户都能读写
drop policy if exists food_defaults_select on public.food_defaults;
create policy food_defaults_select on public.food_defaults
  for select to authenticated using (true);

drop policy if exists food_defaults_insert on public.food_defaults;
create policy food_defaults_insert on public.food_defaults
  for insert to authenticated with check (true);

drop policy if exists food_defaults_update on public.food_defaults;
create policy food_defaults_update on public.food_defaults
  for update to authenticated using (true) with check (true);

drop policy if exists food_defaults_delete on public.food_defaults;
create policy food_defaults_delete on public.food_defaults
  for delete to authenticated using (true);

-- 库存只属于本人
drop policy if exists inventory_items_select on public.inventory_items;
create policy inventory_items_select on public.inventory_items
  for select to authenticated using (user_id = auth.uid());

drop policy if exists inventory_items_insert on public.inventory_items;
create policy inventory_items_insert on public.inventory_items
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists inventory_items_update on public.inventory_items;
create policy inventory_items_update on public.inventory_items
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists inventory_items_delete on public.inventory_items;
create policy inventory_items_delete on public.inventory_items
  for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------
-- 6. 打开实时推送（手机改一下，电脑上的页面立刻跟着变）
--    表已经在发布列表里时 add 会报错，所以吞掉这个异常。
-- ---------------------------------------------------------
do $$
begin
  begin
    alter publication supabase_realtime add table public.food_defaults;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.inventory_items;
  exception when duplicate_object then null;
  end;
end $$;

-- =========================================================
-- 预置食材不用在这里写：第一次登录时页面发现 food_defaults 是空的，
-- 会自动把 fridge/assets/seed-foods.js 里那 79 种灌进去。
-- =========================================================
