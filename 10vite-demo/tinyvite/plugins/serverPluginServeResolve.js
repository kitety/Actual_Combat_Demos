
const fs = require('fs').promises
const path = require('path')
const moduleReg = /^\/@modules\//

function resolveVue (root) {
  // vue有几个部分组成 runtime dom runtime-core  reactivity shared,在后端解析compiler-sfc
  /**
   * 1.compiler文件 拿mod模块 编译在后端 common.js
   * 2.前端 es_module
   */
  // compiler文件 拿mod模块 编译在后端 common.js
  // 描述文件
  const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')
  // 拿到json
  const compilerPkg = require(compilerPkgPath)
  // node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js
  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main)
  const resolvePath = (name) => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)

  const runtimeCorePath = resolvePath('runtime-core')
  const runtimeDomPath = resolvePath('runtime-dom')
  const reactivityPath = resolvePath('reactivity')
  const sharedPath = resolvePath('shared')
  return {
    compiler: compilerPath,//后端编译的文件路径,
    vue: runtimeDomPath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
  }
}

function moduleResolvePlugin ({ app, root }) {
  // 根据当前运行的目录解析出一个映射文件表，包含着vue中的所有模块
  const vueResolved = resolveVue(root)

  app.use(async (ctx, next) => {
    // 处理当前的请求的路径，以/@modules\开头
    if (!moduleReg.test(ctx.path)) {
      return next()
    }
    // 替换@modules/vue
    // /@modules/vue
    const id = ctx.path.replace(moduleReg, '')//vue
    // 当前项目查找真实文件
    // 设置类型 js
    ctx.type = 'js'
    const content = await fs.readFile(vueResolved[id], 'utf8')
    // 返回读取出来的结果
    ctx.body = content
  })
}
exports.moduleResolvePlugin = moduleResolvePlugin
