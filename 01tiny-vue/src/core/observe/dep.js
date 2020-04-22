let uid = 0
export default function Dep () {
  this.id = ++uid
  this.subs = [];
  this.subIds = new Set()
}
Dep.prototype.addSub = function (sub) {
  if (!this.subIds.has(sub.id)) {
    this.subs.push(sub);
    this.subIds.add(sub.id)
  }
};
Dep.prototype.depend = function () {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
};
Dep.prototype.notify = function () {
  this.subs.forEach(function (sub) {
    sub.update();
  });
};
Dep.target = null;
// 这里targetStack是用来保存Dep.target的
const targetStack = []

export function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}
export function popTarget (target) {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
