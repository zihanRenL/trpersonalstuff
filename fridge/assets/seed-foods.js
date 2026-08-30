/* =========================================================
   食材默认信息表 — 首次使用时预置的常见食材
   name        食材名称
   days        默认保质期天数（买回家 / 开封后能放多久）
   storage     储存方式：冷藏 / 冷冻 / 常温
   -----------------------------------------------------
   这里只是"默认值"。任何一条都可以在「食材库」页面改，
   改完只影响之后新加入的食材，不动已经在库存里的记录。
   ========================================================= */
window.SEED_FOODS = [
  /* ---------- 叶菜 ---------- */
  { name: '生菜',     days: 5,   storage: '冷藏' },
  { name: '菠菜',     days: 4,   storage: '冷藏' },
  { name: '小白菜',   days: 4,   storage: '冷藏' },
  { name: '油麦菜',   days: 4,   storage: '冷藏' },
  { name: '大白菜',   days: 14,  storage: '冷藏' },
  { name: '娃娃菜',   days: 10,  storage: '冷藏' },
  { name: '西兰花',   days: 7,   storage: '冷藏' },
  { name: '花菜',     days: 7,   storage: '冷藏' },
  { name: '芹菜',     days: 7,   storage: '冷藏' },
  { name: '韭菜',     days: 3,   storage: '冷藏' },
  { name: '香菜',     days: 4,   storage: '冷藏' },
  { name: '紫甘蓝',   days: 14,  storage: '冷藏' },

  /* ---------- 茄果 / 瓜类 ---------- */
  { name: '西红柿',   days: 7,   storage: '常温' },
  { name: '茄子',     days: 5,   storage: '冷藏' },
  { name: '青椒',     days: 10,  storage: '冷藏' },
  { name: '黄瓜',     days: 7,   storage: '冷藏' },
  { name: '西葫芦',   days: 7,   storage: '冷藏' },
  { name: '苦瓜',     days: 7,   storage: '冷藏' },
  { name: '南瓜',     days: 30,  storage: '常温' },
  { name: '冬瓜',     days: 14,  storage: '常温' },
  { name: '玉米',     days: 5,   storage: '冷藏' },
  { name: '秋葵',     days: 4,   storage: '冷藏' },
  { name: '芦笋',     days: 4,   storage: '冷藏' },
  { name: '四季豆',   days: 5,   storage: '冷藏' },
  { name: '豆芽',     days: 2,   storage: '冷藏' },

  /* ---------- 根茎 ---------- */
  { name: '土豆',     days: 30,  storage: '常温' },
  { name: '洋葱',     days: 30,  storage: '常温' },
  { name: '大蒜',     days: 60,  storage: '常温' },
  { name: '生姜',     days: 21,  storage: '冷藏' },
  { name: '胡萝卜',   days: 21,  storage: '冷藏' },
  { name: '白萝卜',   days: 14,  storage: '冷藏' },
  { name: '山药',     days: 14,  storage: '常温' },
  { name: '莲藕',     days: 7,   storage: '冷藏' },
  { name: '红薯',     days: 21,  storage: '常温' },
  { name: '小葱',     days: 7,   storage: '冷藏' },

  /* ---------- 菌菇 ---------- */
  { name: '口蘑',     days: 5,   storage: '冷藏' },
  { name: '香菇',     days: 7,   storage: '冷藏' },
  { name: '金针菇',   days: 7,   storage: '冷藏' },
  { name: '杏鲍菇',   days: 7,   storage: '冷藏' },
  { name: '木耳（干）', days: 365, storage: '常温' },

  /* ---------- 豆制品 ---------- */
  { name: '豆腐',     days: 3,   storage: '冷藏' },
  { name: '豆干',     days: 5,   storage: '冷藏' },
  { name: '腐竹（干）', days: 180, storage: '常温' },
  { name: '豆浆',     days: 2,   storage: '冷藏' },

  /* ---------- 蛋 / 肉 / 海鲜 ---------- */
  { name: '鸡蛋',     days: 30,  storage: '冷藏' },
  { name: '鸡胸肉',   days: 2,   storage: '冷藏' },
  { name: '鸡腿',     days: 2,   storage: '冷藏' },
  { name: '猪肉',     days: 3,   storage: '冷藏' },
  { name: '五花肉',   days: 3,   storage: '冷藏' },
  { name: '排骨',     days: 3,   storage: '冷藏' },
  { name: '牛肉',     days: 3,   storage: '冷藏' },
  { name: '肉末',     days: 2,   storage: '冷藏' },
  { name: '培根',     days: 7,   storage: '冷藏' },
  { name: '香肠',     days: 7,   storage: '冷藏' },
  { name: '鲜虾',     days: 2,   storage: '冷藏' },
  { name: '三文鱼',   days: 2,   storage: '冷藏' },
  { name: '鲜鱼',     days: 2,   storage: '冷藏' },
  { name: '冷冻鸡胸肉', days: 180, storage: '冷冻' },
  { name: '冷冻虾仁', days: 180, storage: '冷冻' },
  { name: '速冻饺子', days: 90,  storage: '冷冻' },

  /* ---------- 乳制品 ---------- */
  { name: '牛奶（已开封）', days: 5,  storage: '冷藏' },
  { name: '酸奶',     days: 14,  storage: '冷藏' },
  { name: '奶酪片',   days: 14,  storage: '冷藏' },
  { name: '黄油',     days: 60,  storage: '冷藏' },
  { name: '淡奶油（已开封）', days: 7, storage: '冷藏' },

  /* ---------- 水果 ---------- */
  { name: '苹果',     days: 21,  storage: '冷藏' },
  { name: '梨',       days: 14,  storage: '冷藏' },
  { name: '橙子',     days: 14,  storage: '冷藏' },
  { name: '柠檬',     days: 21,  storage: '冷藏' },
  { name: '香蕉',     days: 5,   storage: '常温' },
  { name: '葡萄',     days: 7,   storage: '冷藏' },
  { name: '草莓',     days: 3,   storage: '冷藏' },
  { name: '蓝莓',     days: 7,   storage: '冷藏' },
  { name: '牛油果',   days: 4,   storage: '冷藏' },
  { name: '西瓜（已切开）', days: 3, storage: '冷藏' },

  /* ---------- 主食 / 剩菜 ---------- */
  { name: '剩饭',     days: 3,   storage: '冷藏' },
  { name: '剩菜',     days: 3,   storage: '冷藏' },
  { name: '鲜面条',   days: 3,   storage: '冷藏' },
  { name: '吐司面包', days: 5,   storage: '常温' }
];
