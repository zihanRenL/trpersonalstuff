/* =========================================================
   冰箱食材过期提醒 — 配置
   ---------------------------------------------------------
   两种运行模式，取决于下面这两行填没填：

   1) 都留空  →「本机模式」
      数据存在这台设备的浏览器里，不联网、不同步。
      开箱即用，适合先试试手感。

   2) 填上    →「云端模式」
      数据存在 Supabase，手机和电脑登录同一个账号即可实时同步，
      并且页面会先要求登录才能看到数据。
      建库步骤见 schema.sql 和 README.md。

   SUPABASE_URL      控制台 Project Settings → Data API → Project URL
                     形如 https://abcdefgh.supabase.co
   SUPABASE_ANON_KEY 控制台 Project Settings → API Keys → Publishable key
                     形如 sb_publishable_xxxxxxxx
                     （老项目里这个东西叫 anon key，是一长串 eyJ... 开头的
                       JWT，填哪个都行，作用完全一样）

   注意：Publishable / anon key 本来就是设计成公开给浏览器用的，写在这里没问题，
   真正的保护来自 Supabase 的 RLS 策略（schema.sql 里已经配好）。
   千万不要把 Secret key（sb_secret_... / service_role）写进来，
   那个能绕过所有 RLS。
   ========================================================= */
window.FRIDGE_CONFIG = {
  SUPABASE_URL: 'https://vaoonfnysedgyttxlbga.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_lqSpt8MxW6Uqg4ZHuugX3A_1T0wfxtZ'
};
