import * as Plugin_0 from "C:/Users/kitety/Documents/my/Actual_Combat_Demos/15-umi3/src/app.js";

class Plugin {
  constructor() {
    this.hooks = {};
  }
  // 对象{} {patchRoutes：fn}
  // {apply:{patchRoutes：fn}}
  register(plugin) {
    Object.keys(plugin.apply).forEach((key) => {
      if (!this.hooks[key]) {
        this.hooks[key] = [];
      }
      this.hooks[key] = this.hooks[key].concat(plugin.apply[key]);
    });
  }
  // key 名字 args 参数
  applyPlugins({ key, args }) {
    if (!this.hooks[key]) {
      this.hooks[key] = [];
    }
    this.hooks[key].forEach((hook) => {
      hook(args);
    });
  }
}
let plugin = new Plugin();

plugin.register({
  // apply 导出对象
  apply: Plugin_0,
  // 路径
  path: `C:/Users/kitety/Documents/my/Actual_Combat_Demos/15-umi3/src/app.js`,
});
// 运行时插件 浏览器中跑的
export default plugin;
