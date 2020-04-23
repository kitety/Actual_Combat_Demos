export function parsePath(path) {
  const segments = path.split(".");
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return;
      const element = segments[i];
      obj = obj[element];
    }
    return obj;
  };
}
