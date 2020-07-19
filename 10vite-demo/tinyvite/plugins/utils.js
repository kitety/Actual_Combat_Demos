
const { Readable } = require('stream')
async function readBody (stream) {
  if (stream instanceof Readable) {
    // koa 所有的异步方法包装为promise
    return new Promise((resolve, rej) => {
      let res = ''
      stream.on('data', data => {
        res += data
      })
      stream.on('end', () => {
        resolve(res) //解析结束
      })
    })
  }
  return stream
}
exports.readBody = readBody
