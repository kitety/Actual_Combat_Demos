function* generator() {
  let a = yield 1
  console.log('a: ', a);
  let b = yield 2
  console.log('b: ', b);
  let c = yield 3
  console.log('c: ', c);
}
let it = generator()
let r1 = it.next()
console.log('r1: ', r1);
let r2 = it.next('avalue')
console.log('r2: ', r2);
let r3 = it.next('bvalue')
console.log('r3: ', r3);
let r4 = it.next('cvalue')
console.log('r4: ', r4);
