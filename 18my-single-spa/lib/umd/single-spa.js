(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singleSpa = {}));
}(this, (function (exports) { 'use strict';

  // 应用状态
  const NOT_LOADED = "NOT_LOADED"; // 未加载 初始状态
  const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 加载资源
  const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 还没有调用bootstrap方法
  const BOOTSTRAPPING = "BOOTSTRAPPING"; // 启动中
  const NOT_MOUNTED = "NOT_MOUNTED"; // 没有挂载 没有调用mount方法
  const MOUNTING = "MOUNTING"; // 正在挂载中
  const MOUNTED = "MOUNTED"; // 挂载完毕
  const UN_MOUNTING = "UN_MOUNTING"; // 解除挂载中
  // 当前这个应用是否要被激活
  const isShouldBeActive = (app) => {
    // true 应用应该初始化等一系列操作
    return app.activeWhen(window.location);
  };

  const toBootstrapPromise = async (app) => {
    // 没启动过 不加载
    if (app.status !== NOT_BOOTSTRAPPED) {
      return app;
    }
    // 启动中
    app.status = BOOTSTRAPPING;
    await app.bootstrap(app.customProps);
    app.status = NOT_MOUNTED;
    return app;
  };

  // 数组转换为Promise的执行
  // 通过Promise来链式调用  多个方法组合成一个方法
  const flattenFnArr = (fns) => {
    fns = Array.isArray(fns) ? fns : [fns];
    return (props) => {
      return fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
    };
  };

  const toLoadPromise = async (app) => {
    //  同步一次 异步一次  增加属性
    if (app.loadPromise) {
      return app.loadPromise;
    }
    return (app.loadPromise = Promise.resolve().then(async () => {
      app.status = LOADING_SOURCE_CODE; // 加载 loadApp
      // bootstrap 数组或者方法
      const { bootstrap, mount, unmount } = await app.loadApp(app.customProps);
      app.status = NOT_BOOTSTRAPPED; // 还没有启动 bootstrap

      // 将多个Promise组合到一起
      // 这三个是三个Promise
      app.bootstrap = flattenFnArr(bootstrap);
      app.mount = flattenFnArr(mount);
      app.unmount = flattenFnArr(unmount);
      app.loadPromise = undefined;
      return app;
    }));
  };

  const toMountPromise = async (app) => {
    // 没启动过 不加载
    if (app.status !== NOT_MOUNTED) {
      return app;
    }
    // 启动中
    app.status = MOUNTING;
    await app.mount(app.customProps);
    app.status = MOUNTED;
    return app;
  };

  const toUnmountPromise = async (app) => {
    if (app.status === MOUNTED) {
      app.status = UN_MOUNTING; // 卸载中
      await app.unmount(app.customProps);
      app.status = NOT_MOUNTED; // 未挂载
    }
    // 当前应用没有被挂载就什么都不做
    return app;
  };

  let started = false;
  const start = () => {
    // 挂载应用
    // 除了去加载应用，还要去挂载应用
    started = true;
    reroute();
  };

  // hashchange history api

  // 监听路由方法
  const routingEventListeningTo = ["hashchange", "popstate"];

  const urlReroute = (...reset) => {
    reroute();
  };

  const capturedEventListeners = {
    hashchange: [],
    popstate: [],
  };

  // 我们处理应用加载的逻辑实在最前面
  window.addEventListener("hashchange", urlReroute);
  window.addEventListener("popstate", urlReroute);

  const originAddEventListener = window.addEventListener;

  window.addEventListener = function (eventName, fn) {
    if (
      routingEventListeningTo.includes(eventName) &&
      !capturedEventListeners[eventName].includes(fn)
    ) {
      capturedEventListeners[eventName].push(fn);
      return;
    }
    return originAddEventListener.apply(this, arguments);
  };
  window.removeEventListener = function (eventName, fn) {
    if (routingEventListeningTo.includes(eventName)) {
      capturedEventListeners[eventName] = capturedEventListeners[
        eventName
      ].filter((item) => item !== fn);
      return;
    }
    return originAddEventLoriginRemoveEventListeneristener.apply(this, arguments);
  };

  // 绑定自己的路由事件
  // 我们应用切换后还要处理原来的方法  需要在应用切换后执行
  /**
   * hash 路由 hash变化时可以切换
   * 浏览器路由是 基于 h5 api  切换时不会触发popState
   */
  function patchUpdateState(update, methodName) {
    return function () {
      const urlBefore = window.location.href;
      update.apply(this, arguments); // 调用切换
      const afterBefore = window.location.href;
      if (urlBefore !== afterBefore) {
        // 重新加载应用 传入 事件源
        urlReroute(new PopStateEvent("popstate"));
      }
    };
  }
  window.history.pushState = patchUpdateState(
    window.history.pushState);
  window.history.replaceState = patchUpdateState(
    window.history.replaceState);

  // 核心应用处理方法
  const reroute = () => {
    /**
     * 需要获取要加载的应用
     * 需要获取要被挂载的应用
     * 哪些应用需要被卸载
     */

    const { appToUnmount, appToLoad, appToMount } = getAppChanges();
    console.log(
      "appToUnmount, appToLoad, appToMount: ",
      appToUnmount,
      appToLoad,
      appToMount
    );

    if (started) {
      // 调用start()
      // app 挂载

      console.log("调用start");
      // 根据路径来装载应用
      return performAppChanges();
    } else {
      // 没调用start()
      // 注册应用时  需要预先加载
      console.log("调用register");
      return loadApps(); // 预先加载应用
    }
  };
  // 预先加载应用
  const loadApps = async () => {
    const { appToLoad } = getAppChanges();
    // appToLoad 是Promise
    // 获取到bootstrap mount unmount, 放到app
    let apps = await Promise.all(appToLoad.map(toLoadPromise));
    console.log("apps: ", apps);
  };
  // 根据路径来装载应用
  const performAppChanges = async () => {
    // 卸载不需要的应用、
    // 去加载需要的应用
    const { appToUnmount, appToLoad, appToMount } = getAppChanges();
    // 卸载不需要的应用
    // 并发卸载
    appToUnmount.map(toUnmountPromise);
  // 这个应用可能需要加载 但是路径不匹配 加载app1的时候， 这个时候切换到app2
    appToLoad.map(async (app) => {
      // 将需要被加载的应用拿到--加载--启动--挂载
      app = await toLoadPromise(app); // 加载
      app = await toBootstrapPromise(app); // 启动
      return await toMountPromise(app);
    });
    appToMount.map(async (app) => {
      // 将需要被加载的应用拿到--启动--挂载
      app = await toBootstrapPromise(app); // 启动
      return await toMountPromise(app);
    });
  };

  // 这个流程用于初始化
  // 当路径切换 重新加载
  // 重写路由相关方法

  /**
   *
   * @param {*} name 应用名称
   * @param {*} loadApp 加载的应用
   * @param {*} activeWhen 当激活时会调用
   * @param {*} customProps 自定义属性
   */

  // 用来放所有的应用
  const apps = [];

  // 维护应用的所有状态 状态机
  const registerApplication = (name, loadApp, activeWhen, customProps) => {
    // 注册引用
    apps.push({
      name,
      loadApp,
      activeWhen,
      customProps,
      status: NOT_LOADED,
    });
    console.log("apps: ", apps);
    // 生命周期
    // reroute 加载应用  被激活的时候就加载应用
    reroute();
  };
  const getAppChanges = () => {
    const appToUnmount = []; // 要卸载的app
    const appToLoad = []; // 要加载的app
    const appToMount = []; // 要挂载的app
    apps.forEach((app) => {
      // 需不需要被加载的
      // 没报错
      const appShouldBeActive = isShouldBeActive(app);
      switch (app.status) {
        case NOT_LOADED:
        case LOADING_SOURCE_CODE:
          // 没加载 或者 正在加载代码
          if (appShouldBeActive) {
            appToLoad.push(app);
          }
          break;
        case NOT_BOOTSTRAPPED:
        case BOOTSTRAPPING:
        case NOT_MOUNTED:
          if (appShouldBeActive) {
            appToMount.push(app);
          }
          break;
        case MOUNTED:
          // 卸载
          if (!appShouldBeActive) {
            appToUnmount.push(app);
          }
          break;
      }
    });
    return {
      appToUnmount,
      appToLoad,
      appToMount,
    };
  };

  const a = 1;
  console.log("a: ", a);

  exports.a = a;
  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=single-spa.js.map
