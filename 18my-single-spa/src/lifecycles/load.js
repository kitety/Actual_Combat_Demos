import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPPED,
} from "../application/app.helpers";

// 数组转换为Promise的执行
// 通过Promise来链式调用  多个方法组合成一个方法
const flattenFnArr = (fns) => {
  fns = Array.isArray(fns) ? fns : [fns];
  return (props) => {
    return fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
  };
};

export const toLoadPromise = async (app) => {
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
