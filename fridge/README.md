# 冰箱食材过期提醒

追踪冰箱里每一份食材还能放几天，按紧急程度用红 / 橙 / 绿三档提醒，别再把菜放到烂。

响应式网页 + PWA，手机和电脑用同一个网址，可以「添加到主屏幕」当 App 用。
纯 HTML / CSS / JS，没有构建步骤，和这个仓库里的其他页面一样直接丢给静态托管就能跑。

```
fridge/
  index.html            我的库存（首页）
  foods.html            食材库 —— 每种食材的默认保质期
  pedia.html            蔬菜储存百科（静态内容，和库存无关）
  config.js             ← 只有这个文件需要你填
  schema.sql            Supabase 建表脚本
  manifest.webmanifest  PWA 清单
  sw.js                 Service Worker（离线打开外壳）
  icons/                应用图标
  assets/
    app.css
    store.js            数据层：本机 / 云端两种实现，页面无感知
    ui.js               顶栏、弹层、提示条、登录闸门、PWA 注册
    home.js  foods.js  pedia.js
    seed-foods.js       预置的 79 种常见食材及默认保质期
    pedia-data.js       储存百科的内容
```

## 两种运行模式

| | 本机模式 | 云端模式 |
| --- | --- | --- |
| 触发条件 | `config.js` 留空（默认） | `config.js` 填了 Supabase 地址和 key |
| 数据存哪 | 这台设备的浏览器里 | Supabase |
| 手机 ↔ 电脑同步 | 不同步 | 实时同步 |
| 登录保护 | 无 | 有，邮箱 + 密码 |

先按本机模式试手感，觉得顺手了再花十分钟接 Supabase。切过去之后本机那份数据不会自动搬，
手上东西不多的话重新录一遍最省事。

## 接 Supabase（十分钟）

1. 在 [supabase.com](https://supabase.com) 建一个免费项目。
2. 控制台 → **SQL Editor** → 新建 query → 把 `schema.sql` 整个贴进去 → Run。
   建两张表、配好 RLS、打开实时推送，一次搞定。
3. 控制台 → **Authentication → Users** → **Add user**，用邮箱和密码建一个你自己的账号
   （勾上 auto confirm，省掉验证邮件）。
4. 同一页的 **Authentication → Sign In / Providers**，把 **Allow new users to sign up** 关掉。
   这样除了你手动建的那个账号，别人注册不进来。
5. 抄两样东西填进 `config.js`。新版控制台把它们放在了两个不同的页面：

   | 填什么 | 去哪找 | 长什么样 |
   | --- | --- | --- |
   | `SUPABASE_URL` | **Project Settings → Data API → Project URL** | `https://abcdefgh.supabase.co` |
   | `SUPABASE_ANON_KEY` | **Project Settings → API Keys → Publishable key** | `sb_publishable_xxxxxxxx` |

   ```js
   window.FRIDGE_CONFIG = {
     SUPABASE_URL: 'https://abcdefgh.supabase.co',
     SUPABASE_ANON_KEY: 'sb_publishable_xxxxxxxx'
   };
   ```

   老项目的 API Keys 页面上没有 Publishable key，只有 **anon public**（一长串 `eyJ...`
   开头的 JWT）。填那个也一样，两者作用完全相同，代码不用改。

6. 提交、推上去。刷新页面就会先要求登录，登录后第一次会自动把 79 种预置食材灌进 `food_defaults`。

**关于安全性，说清楚一点：** Publishable key（旧称 anon key）本来就是设计成公开给浏览器用的，
Supabase 自己也标着 "can be safely shared publicly"，写进仓库没问题；
真正拦住外人的是 `schema.sql` 里的 RLS 策略 —— 没登录就一行数据都读不到。
但页面本身（HTML / CSS / JS）在静态托管上永远是公开的，任何人打开网址都能看到登录框，
只是看不到你的数据。想连登录框都藏起来，得换成有服务端的托管方式。
另外**千万别**把 **Secret key**（`sb_secret_...`，旧称 `service_role`）填进 `config.js`，
那个 key 能绕过所有 RLS。它只该出现在服务端，这个项目从头到尾都不需要它。

## 部署

这个仓库已经配了 GitHub Pages（`.github/workflows/pages.yml`，推 `main` 就自动发布），
所以把这个分支合进 `main` 之后，直接访问
`https://zihanrenl.github.io/trpersonalstuff/fridge/` 就行，不需要再上 Vercel。

第一次发布前先确认 GitHub 仓库 **Settings → Pages → Build and deployment → Source**
选的是 **GitHub Actions**（workflow 里的 `enablement: true` 一般会自动打开它，
但保险起见看一眼）。发布进度在仓库的 **Actions** 标签页里看。

想换 Vercel、Netlify 也可以：把仓库根目录当静态站点发布即可，无需构建命令，
入口路径同样是 `/fridge/`。

PWA 要求 HTTPS，GitHub Pages 自带；本地调试用 `localhost` 也算安全上下文。

**顺序建议**：先合进 `main` 把网址跑通（此时是本机模式，能直接用），
再回头配 Supabase 填 `config.js`，改完再推一次。不用一次做完。

## 添加到主屏幕

- **iPhone / iPad（Safari）**：打开网址 → 分享按钮 → 「添加到主屏幕」。
- **Android（Chrome）**：打开网址 → 右上角菜单 → 「安装应用」或「添加到主屏幕」。

装好之后是独立窗口、没有浏览器地址栏，图标是那个蓝色小冰箱。

## 本地跑

```bash
npx http-server -p 8080     # 然后打开 http://localhost:8080/fridge/
```

直接双击 `index.html` 用 `file://` 打开也能看，只是 Service Worker 不会注册。

## 颜色分级规则

剩余天数 = 这一份的保质期天数 − （今天 − 加入日期），每次打开现算，不存数据库。

| 颜色 | 条件 |
| --- | --- |
| 🔴 红 | 剩余 ≤ 2 天（含已经过期的） |
| 🟠 橙 | 剩余 3–6 天 |
| 🟢 绿 | 剩余 > 6 天 |

「新加入」（三天内加的）只是绿色档里的一个小标签。一份食材同时满足「新加入」和红 / 橙时，
按红 / 橙显示 —— 绿色只用来表示确实还没有过期风险。

## 两个改保质期的入口，别混

- **改某一份**：首页那条记录右边的「改」。用来对上包装实际标注的日期，只影响这一份。
- **改默认值**：「食材库」页面里点某个食材的「改」。只影响**以后**新加入的同名食材，
  库存里已有的记录一律不动。

## 改内容

- 预置食材和默认天数：`assets/seed-foods.js`。
  自动灌数据只在 `food_defaults` 完全空着时发生（避免把你删掉的条目又塞回来）。
  库里已经有东西之后，「食材库」页面上会出现一颗**「补齐预置食材」**按钮，
  点它把清单里还缺的补进来 —— 只补缺的，同名的那条原样保留，
  你改过的默认天数不会被覆盖，随时可以再点，不会重复。
  所以往 `seed-foods.js` 里新加了食材，也是靠这颗按钮同步进数据库。
- 储存百科的条目：`assets/pedia-data.js`，往数组里加对象就会出现在页面上，分类会自动去重。
- 改了任何页面文件，把 `sw.js` 里的 `VERSION` 加一位，否则装过 PWA 的设备会继续用旧缓存。

## 这一版没做

拍照识别导入食材、根据库存自动推荐菜谱。
