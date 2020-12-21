{{#plugins}}
import * as Plugin_{{{index}}} from "{{{path}}}";

{{/plugins}}
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
{{#plugins}}

plugin.register({
  // apply 导出对象
  apply: Plugin_{{{index}}},
  // 路径
  path: `{{{path}}}`,
});
{{/plugins}}
// 运行时插件 浏览器中跑的
export default plugin;
