
const fs = require('fs').promises

function vuePlugin ({ app, root }) {
  app.use(async (ctx, next) => {
    if (!ctx.path.endWith('.vue')) {
      return next()
    }
    // vue
    const filePath = path.join(root, ctx.path)
    const content = await fs.readFile(filePath, 'utf-8')//vue中的内容

    // 获取文件内容

  })

}
exports.vuePlugin = vuePlugin
