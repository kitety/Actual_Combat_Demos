// hashchange history api

import { reroute } from "./reroute";

// 监听路由方法
export const routingEventListeningTo = ["hashchange", "popstate"];

const urlReroute = (...reset) => {
  reroute([], reset);
};

const capturedEventListeners = {
  hashchange: [],
  popstate: [],
};

// 我们处理应用加载的逻辑实在最前面
window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);

const originAddEventListener = window.addEventListener;
const originRemoveEventListener = window.removeEventListener;

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
  window.history.pushState,
  "pushState"
);
window.history.replaceState = patchUpdateState(
  window.history.replaceState,
  "replaceState"
);
