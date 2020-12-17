let PluginApi = require("./PluginApi");
let { AsyncParallelHook } = require("tapable"); // 异步串行钩子

/**
 * service 插件核心 微内核
 * 1.命令的注册和执行
 */
class Service {
  constructor(opts) {
    // key命令名字 值 命令对象  {dev:{fn}}
    // 通过插件注册
    this.commands = {}; // 存放着所有的命令和他们的实现 // dev等等
    // 取出插件 [{ id: "dev", apply: pluginDev }]
    this.plugins = opts.plugins;
    this.hookByPluginId = {}; // 按照插件ID绑定的钩子 {插件id :[hook]}
    this.hooks = {}; // 钩子 按照事件类型划分 {'event':[hook]}
  }
  init() {
    // 初始化
    for (const plugin of this.plugins) {
      let pluginApi = new PluginApi({ id: plugin.id, service: this });
      // 注册之后放在 hookByPluginId
      pluginApi.onGenerateFiles = (fn) => {
        // 注册hook id key fn
        pluginApi.register({ pluginId: plugin.id, key: "onGenerateFiles", fn });
      };
      // 传入pluginApi 进行插件的注册
      plugin.apply(pluginApi);
    }
    // this.hooks初始化
    Object.keys(this.hookByPluginId).forEach((pluginId) => {
      let pluginHooks = this.hookByPluginId[pluginId] || [];
      pluginHooks.forEach((hook) => {
        const { key } = hook;
        hook.pluginId = pluginId; // 这个hook是哪个插件挂载上来的
        this.hooks[key] = (this.hooks[key] || []).concat(hook);
      });
    });
  }
  // 调用插件
  async applyPlugins(opts) {
    // 找key对应的hooks数组
    let hooksForKey = this.hooks[opts.key] || [];
    let tEvent = new AsyncParallelHook(["_"]);
    for (const hook of hooksForKey) {
      tEvent.tapPromise({ name: hook.pluginId }, hook.fn);
    }
    return await tEvent.promise();
  }
  async run(args) {
    // 挂载插件
    this.init();
    return await this.runCommand(args);
  }
  async runCommand({ name }) {
    // dev...
    const command = this.commands[name];
    // 执行命令
    return command.fn();
  }
}
module.exports = Service;
