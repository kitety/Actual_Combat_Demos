import Dep from "./dep";
export default function Watcher(vm, cb) {
  this.cb = cb;
  this.vm = vm;
  // 为了触发属性的getter 从而在dep添加自己
  this.value = this.get();
}
Watcher.prototype.get = function () {
  Dep.target = this;
  this.cb.call(this);
  Dep.target = null;
};
Watcher.prototype.update = function () {
  return this.get();
};
