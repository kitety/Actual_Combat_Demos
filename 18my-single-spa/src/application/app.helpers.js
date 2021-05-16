// 应用状态
export const NOT_LOADED = "NOT_LOADED"; // 未加载 初始状态
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE"; // 加载资源
export const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED"; // 还没有调用bootstrap方法
export const BOOTSTRAPPING = "BOOTSTRAPPING"; // 启动中
export const NOT_MOUNTED = "NOT_MOUNTED"; // 没有挂载 没有调用mount方法
export const MOUNTING = "MOUNTING"; // 正在挂载中
export const MOUNTED = "MOUNTED"; // 挂载完毕
export const UPDATING = "UPDATING"; // 更新中
export const UN_MOUNTING = "UN_MOUNTING"; // 解除挂载中
export const UN_LOADING = "UN_LOADING"; // 完全卸载中
export const LOAD_ERR = "LOAD_ERR"; // 资源加载失败
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN"; // 出错

// 当前应用是否被激活
export const isActive = (app) => {
  // 挂载完了才是真正的被激活
  return app.status === MOUNTED;
};
// 当前这个应用是否要被激活
export const isShouldBeActive = (app) => {
  // true 应用应该初始化等一系列操作
  return app.activeWhen(window.location);
};
