const Koa = require('koa')
// 服务端启动静态服务的插件
const { serveStaticPlugin } = require('./plugins/serverPluginServeStatic')
const { moduleRewritePlugin } = require('./plugins/serverPluginServeRewrite')
const { moduleResolvePlugin } = require('./plugins/serverPluginServeResolve')
const { htmlRewritePlugin } = require('./plugins/serverPluginHtml')
const { vuePlugin } = require('./plugins/serverPluginVue')

function createServer () {
  // 创建实例
  const app = new Koa()
  // 进程的当前运行目录
  const root = process.cwd()
  console.log(root);
  // 基于中间件


  // 上下文
  const context = { app, root }
  // 依次加载插件
  const resolvePlugins = [
    vuePlugin,
    // 插件集合
    htmlRewritePlugin,//html
    // 2.解析import语法，重写路径
    moduleRewritePlugin,
    // 3.解析以@modules开头的文件
    moduleResolvePlugin,
    // 1.静态服务
    // 读取文件，将读取文件的结果放在了ctx的body
    serveStaticPlugin
  ]
  resolvePlugins.forEach(plugin => plugin(context))
  // app有listen
  return app
}
module.exports = createServer
