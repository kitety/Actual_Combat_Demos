let a = [
  { id: 1, num: 1 },
  { id: 2, num: 1 },
];
let b = [
  { id: 2, num: 1 },
  { id: 3, num: 1 },
];
function f(...data) {
  const obj = {};
  for (const item of data) {
    for (const u of item) {
      const { id, num } = u;
      obj[id] = (obj[id] || 0) + num;
    }
  }
  const t = Object.keys(obj).map((item) => ({
    id: Number(item),
    num: obj[item],
  }));
  console.log("t: ", t);
}
f(a, b);
