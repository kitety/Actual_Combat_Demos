## 安装vite
```bash
npm  i -g create-vite-app
create-vite-app projectName
// 活着
npm init vite-app projectName
```

## 第一次
- 优化 [vite] Optimizable dependencies detected:
- node_modules生成.vite_opt_cache
- 第一次有点慢，第二次毫秒级
- 后台编译，直接引入.vue文件，内容有变化，会编译一遍
- import { createApp } from '/@modules/vue.js'  路径变化
