import { MOUNTED, MOUNTING, NOT_MOUNTED } from "../application/app.helpers";

export const toMountPromise = async (app) => {
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
