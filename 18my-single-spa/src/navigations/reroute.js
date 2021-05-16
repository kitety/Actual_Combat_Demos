import { getAppChanges } from "../application/app";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";
import './navigator-events'

// 核心应用处理方法
export const reroute = () => {
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
  let unmountPromises = appToUnmount.map(toUnmountPromise);
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
