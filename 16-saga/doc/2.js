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
let r2 = it.throw('出错了')
// 错误了之后会跳过后面的执行 进入trycatch
console.log('r2: ', r2);

