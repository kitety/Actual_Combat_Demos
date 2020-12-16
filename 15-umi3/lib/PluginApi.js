class PluginApi {
  constructor(opts) {
    this.id = opts.id;
    this.service = opts.service;
  }
  registerCommand(command) {
    // 注册命令-> service
    // this.service.commands['dev'] = {name  description fn};
    this.service.commands[command.name] = command;
  }
}
module.exports = PluginApi;
