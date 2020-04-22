import Dep from "./dep";
export function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      var dep = new Dep();
      let val = data[key];
      // 递归
      observe(val);
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
          console.log("get");
          if (Dep.target) {
            // 其实add的是vm实例
            // 再调用vm的update
            dep.depend()
          }
          return val;
        },
        set(newVal) {
          if (newVal === val) return;
          console.log("set");
          val = newVal;
          dep.notify(); //通知订阅
        },
      });
    }
  }
}
function Observer(key) {}
