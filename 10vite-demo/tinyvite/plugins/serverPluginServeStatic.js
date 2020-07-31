const static = require('koa-static')
const path = require('path')
function serveStaticPlugin ({ app, root }) {
  // 在哪运行就用那个作为静态服务
  app.use(static(root))
  // public
  app.use(static(path.join(root, 'public')))
}

exports.serveStaticPlugin = serveStaticPlugin
