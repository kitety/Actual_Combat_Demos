#! /usr/bin/env node
console.log(111);
const createServer = require('../index')
/**+
 * http启动模块，内部基于koa
 * 
 *  es-module-lexer 解析import语法，ast
 * koa-static koa启动静态服务
 * magic-string 修改字符串 
 * 
 * 
 * 
 * 创建koa 服务
 */
createServer().listen(4000, () => {
  console.log('server start 4000', 'http://localhost:4000');
})
