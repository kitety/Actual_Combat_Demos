const { readBody } = require('./utils')
const { parse } = require('es-module-lexer') //解析import语法
const MagicString = require('magic-string')//字符串不变性
function rewriteImports (source) {
  let imports = parse(source)[0]
  console.log(imports);
  let magicString = new MagicString(source)// overwrite
  if (imports.length) {
    for (let i = 0; i < imports.length; i++) {
      let { s, e } = imports[i];
      let id = source.substring(s, e) // vue .App
      console.log(id);
      //  不是/  .
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`
        magicString.overwrite(s, e, id)
      }
    }
  }
  return magicString.toString()
}
function moduleRewritePlugin ({ app, root }) {
  app.use(async (ctx, next) => {
    console.log(11112121);
    await next()// ctx.body=await fs.readfile
    // 完善逻辑 洋葱
    console.log(ctx.response.type);
    // 读取流的代码
    if (ctx.body && ctx.response.is('js')) {
      // console.log(ctx.response.type);
      let content = await readBody(ctx.body);
      // 重写内容 将重写后的结果返回
      const result = rewriteImports(content)
      ctx.body = result
    }
  })
}

exports.moduleRewritePlugin = moduleRewritePlugin
