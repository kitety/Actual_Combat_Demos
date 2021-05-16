import {
  BOOTSTRAPPING,
  NOT_BOOTSTRAPPED,
  NOT_MOUNTED,
} from "../application/app.helpers";

export const toBootstrapPromise = async (app) => {
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
