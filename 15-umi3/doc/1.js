let { AsyncParallelHook } = require("tapable"); // 异步串行钩子

let hook1 = {
  key: "click",
  fn: async () => {
    console.log("click1");
    return Promise.resolve("click1");
  },
};
let hook2 = {
  key: "click",
  fn: async () => {
    console.log("click2");

    return Promise.resolve("click2");
  },
};
let hook4 = {
  key: "mousemove",
  fn: async () => {
    return Promise.resolve("mousemove1");
  },
};
let hook3 = {
  key: "mousemove",
  fn: async () => {
    return Promise.resolve("mousemove2");
  },
};
// 有很多插件 每个插件有可能会注册很多hook 每个hook的事件类型是不一样的

let hookByPluginId = {
  plugin1: [hook1, hook3],
  plugin2: [hook2, hook4],
};
let hooks = {};
// 按照事件类型来分组

Object.keys(hookByPluginId).forEach((pluginId) => {
  let pluginHooks = hookByPluginId[pluginId] || [];
  pluginHooks.forEach((hook) => {
    const { key } = hook;
    hook.pluginId = pluginId; // 这个hook是哪个插件挂载上来的
    hooks[key] = (hooks[key] || []).concat(hook);
  });
});

console.log("hooks: ", hooks);

async function applyPlugins(opts) {
  // 找key对应的hooks数组
  let hooksForKey = hooks[opts.key] || [];
  let tEvent = new AsyncParallelHook(["_"]);
  for (const hook of hooksForKey) {
    tEvent.tapPromise({ name: hook.pluginId }, hook.fn);
  }
  return await tEvent.promise();
}
applyPlugins({ key: "click" });
