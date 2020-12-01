// 这样得到全局的IO对象

let socket = window.io("/");

class Emitter {
  constructor() {
    this.listener = {};
  }
  on(type, listener) {
    this.listener[type] = listener;
  }
  emit(type) {
    this.listener[type] && this.listener[type]();
  }
}
let currentHash; // 这一次的hash
let hotCurrentHash; // lastHash 上一次的hash
let hotEmitter = new Emitter();
hotEmitter.on("webpackHotUpdate", function () {
  // 基于上次的hash 算出布丁包
  if (!hotCurrentHash || hotCurrentHash === currentHash) {
    // 没有上一次或者两次相等
    return (hotCurrentHash = currentHash);
  }
  hotCheck();
});
function hotCheck() {
  hotDownloadManifest().then((update) => {
    // 得到哪些文件改变了
    let chunkIds = Object.keys(update.c);
    chunkIds.forEach((chunkId) => {
      hotDownloadUpdateChunk(chunkId);
    });
  });
}
// 下载新的代码块 jsonp
function hotDownloadUpdateChunk(chunkId) {
  let script = document.createElement("script");
  script.charset = "utf-8";
  // /main.xxx.hot-update.js
  script.src = "/" + chunkId + "." + hotCurrentHash + ".hot-update.js";
  document.head.appendChild(script);
}
// 此方法去询问服务器 这次以编译相对于上次编译改变了哪些chunk 模块
function hotDownloadManifest() {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    // 上次的hash 上次的和这次的hash
    // hot-update.json 上一次编译到这次编译的修改
    let requestPath = "/" + hotCurrentHash + ".hot-update.json";
    request.open("GET", requestPath, true);
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        // 结束
        let update = JSON.parse(request.responseText);
        resolve(update);
      }
    };
    request.send();
  });
}
// 连接的事件
function onConnected() {
  console.log("客户端连接成功");
}
// ok事件之后会重新刷新app
function reloadApp(hot) {
  // 如果hot true 热更新逻辑
  if (hot) {
    hotEmitter.emit("webpackHotUpdate");
  } else {
    // 不支持热更新
    window.location.reload();
  }
}
socket.on("hash", (hash) => {
  console.log("hash: ", hash);
  // hotCurrentHash = currentHash;
  currentHash = hash;
});
socket.on("ok", () => {
  reloadApp(true);
});
// chunkId, moreModules对象
window.webpackHotUpdate = function (chunkId, moreModules) {
  for (const moduleId in moreModules) {
    // 找到旧的代码
    // 从缓存的模块取旧的值
    let oldModule = __webpack_require__.c[moduleId];
    // parent 哪些模块引用了这个模块 title=> ['./src/index.js]
    // children 这个模块引用了哪些模块
    let { parents, children } = oldModule;
    // 更新缓存为最新代码
    let module = (__webpack_require__.c[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
      hot: window.hotCreateModule(moduleId), //是个对象
      parents,
      children,
    });
    // 更新代码
    moreModules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    // 已经loader
    module.l = true;
    parents.forEach((parent) => {
      let parentModule = __webpack_require__.c[parent];
      parentModule &&
        parentModule.hot &&
        parentModule.hot._acceptedDependencies[moduleId]();
    });
    hotCurrentHash = currentHash;
  }
};
// 生成hot对象
/**
 * module.hot.accept(["./title"], () => {
    render();
  });
 */
window.hotCreateModule = function (moduleId) {
  let hot = {
    _acceptedDependencies: {},
    // index的module hot
    accept: function (deps, callback) {
      for (let i = 0; i < deps.length; i++) {
        hot._acceptedDependencies[deps[i]] = callback;
      }
    },
  };
  return hot;
};
socket.on("connected", onConnected);
