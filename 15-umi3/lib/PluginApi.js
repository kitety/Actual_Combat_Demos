class PluginApi {
  constructor(opts) {
    // id 就是plugin id
    this.id = opts.id;
    this.service = opts.service;
  }
  // 注册命令
  registerCommand(command) {
    // 注册命令-> service
    // this.service.commands['dev'] = {name  description fn};
    this.service.commands[command.name] = command;
  }
  // 注册hook
  register(hook) {
    // 插件挂载hook
    this.service.hookByPluginId[this.id] = (
      this.service.hookByPluginId[hook.id] || []
    ).concat(hook);
  }
}
module.exports = PluginApi;
