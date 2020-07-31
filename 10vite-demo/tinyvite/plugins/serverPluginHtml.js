

const { readBody } = require('./utils')
function htmlRewritePlugin ({ app, root }) {
  const inject = ` <script>
   window.process={}
    window.process.env = {
      'NODE_ENV': 'development'
    }
  </script>`

  // 这里做热更新
  app.use(async (ctx, next) => {
    await next()

    if (ctx.body && ctx.response.is('html')) {
      // console.log(ctx.response.type);
      let html = await readBody(ctx.body);

      ctx.body = html.replace(/<head>/, `$&${inject}`)
    }
  })
}
exports.htmlRewritePlugin = htmlRewritePlugin
