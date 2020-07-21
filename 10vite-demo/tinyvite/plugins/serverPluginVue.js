
const fs = require('fs').promises
import { resolveVue } from './serverPluginServeResolve'
const path = require('path');

function vuePlugin ({ app, root }) {
  app.use(async (ctx, next) => {
    if (!ctx.path.endWith('.vue')) {
      return next()
    }
    // vue
    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf-8')//vue中的内容

    // 获取文件内容
    // 找到compiler ，拿到模板编译模块进行编译
    let { parse, compileTemplate } = require(resolveVue(root).compiler)
    let { descriptor } = parse(content) // 解析
    if(!ctx.query.type){

    }

  })

}
exports.vuePlugin = vuePlugin
