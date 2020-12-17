let { AsyncParallelHook } = require("tapable"); // 异步串行钩子
// 作用类似于promise.all()
let hook = new AsyncParallelHook();
console.time("cost");
hook.tapPromise("1", () => {
  return new Promise((res) => {
    setTimeout(res, 1000);
  });
});
hook.tapPromise("2", () => {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
});
hook.tapPromise("3", () => {
  return new Promise((res) => {
    setTimeout(res, 3000);
  });
});
// 触发执行
hook.promise().then((res) => {
  console.timeEnd("cost");

  console.log("执行完成");
});
