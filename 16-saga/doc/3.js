function* generator() {
  try {
    let a = yield 1
    console.log('a: ', a);
    let b = yield 2
    console.log('b: ', b);
  } catch (error) {
    console.log('error: ', error);

  }

}
let it = generator()
let r1 = it.next()
console.log('r1: ', r1);
// 直接结束本迭代器  后面在saga取消任务的时候会用到
let r2 = it.return('return value')
console.log('r2: ', r2);

