/**
 *
 * @param {*} name 应用名称
 * @param {*} loadApp 加载的应用
 * @param {*} activeWhen 当激活时会调用
 * @param {*} customProps 自定义属性
 */

import { reroute } from "../navigations/reroute";
import {
  BOOTSTRAPPING,
  isShouldBeActive,
  LOADING_SOURCE_CODE,
  MOUNTED,
  NOT_BOOTSTRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
} from "./app.helpers";

// 用来放所有的应用
const apps = [];

// 维护应用的所有状态 状态机
export const registerApplication = (name, loadApp, activeWhen, customProps) => {
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
export const getAppChanges = () => {
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
      default:
        break;
    }
  });
  return {
    appToUnmount,
    appToLoad,
    appToMount,
  };
};
