function* generator() {
  let a = yield 1
  console.log('a: ', a);
  let b = yield 2
  console.log('b: ', b);
  let c = yield 3
  console.log('c: ', c);
}
function co(generator) {
  let it = generator()
  let result;
  function next(args) {
    result = it.next(args)
    if(!result.done){
      next(result.value)
    }
  }
  next()
}
co(generator)
