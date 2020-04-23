const _toString = Object.prototype.toString;
export function noop () { }
export function isPlainObject (obj) {
  return _toString.call(obj) === "[object Object]";
}
export function extend (to, _form) {
  for (const key in _form) {
    to[key] = _form[key];
  }
  return to
}
