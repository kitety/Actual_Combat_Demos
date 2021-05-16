import { reroute } from "./navigations/reroute";

export let started = false;
export const start = () => {
  // 挂载应用
  // 除了去加载应用，还要去挂载应用
  started = true;
  reroute();
};
