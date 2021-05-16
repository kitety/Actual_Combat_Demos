import { MOUNTED, NOT_MOUNTED, UN_MOUNTING } from "../application/app.helpers";

export const toUnmountPromise = async (app) => {
  if (app.status === MOUNTED) {
    app.status = UN_MOUNTING; // 卸载中
    await app.unmount(app.customProps);
    app.status = NOT_MOUNTED; // 未挂载
  }
  // 当前应用没有被挂载就什么都不做
  return app;
};
