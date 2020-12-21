let { absPagesPath } = require("./getPaths");
let { join, basename, extname, resolve, relative } = require("path");
let { readdirSync, existsSync, statSync } = require("fs");
let { winPath } = require("./utils");
/**
 *
 * @param {root} root pages 根目录
 * @param {relDir} relDir 子目录
 */
function getRoutes(opts = {}) {
  // root pages根目录
  const { root, relDir = "" } = opts;
  const files = getFiles(join(root, relDir)); //获取此目录下面的所有文件列表

  const routes = files.reduce(fileToRouteReducer.bind(null, opts), []);
  return routes;
}
/**
 // 文件转换为路由
 *  {
      path: "/profile",
      exact: true,
      component: require("@/pages/profile.js").default,
    },
    routes 累加的数组
    file 一个个的文件
 */
function fileToRouteReducer(opts, routes, file) {
  const { root, relDir = "" } = opts;
  // 当前的绝对路径 pages 相对目录 index.js
  // add.js pages + user +add.js
  const absPathFile = join(root, relDir, file);
  const stats = statSync(absPathFile);
  if (stats.isDirectory()) {
    // 目录
    const relFile = join(relDir, file); // ''+user--user
    let layoutFile = join(root, relFile, "_layout.js");
    let route = {
      path: normalizePath(relFile),
      // 递归
      routes: getRoutes({
        ...opts,
        relDir: relFile, //相对目录
      }),
    };
    // 判断模板文件
    if (existsSync(layoutFile)) {
      // @/pages/user/_layout.js
      route.component = toComponentPath(root, layoutFile);
    }
    routes.push(route);
  } else {
    // 文件
    let fileName = basename(file, extname(file));
    routes.push({
      path: normalizePath(join(relDir, fileName)), //TODO
      exact: true,
      component: toComponentPath(root, absPathFile),
    });
  }
  return routes;
}
function normalizePath(path) {
  // 用winPath处理
  path = winPath(path);
  path = `/${path}`;
  // 把\index结束的变为/
  path = path.replace(/\/index$/, "/");
  return path;
}
function toComponentPath(root, absPathFile) {
  // resolve(root, "..") root的父目录-> src的绝对路径
  // relative 两个绝对路径取相对路径
  // C:\Users\kitety\Documents\my\Actual_Combat_Demos\15-umi3\src
  // C:\Users\kitety\Documents\my\Actual_Combat_Demos\15-umi3\src\pages\index.js
  // \pages\index.js;
  // 路径分割 win\  mac linux/   webpack->/

  return winPath(`@/${relative(resolve(root, ".."), absPathFile)}`);
}
// 获取文件
function getFiles(root) {
  // 目录不存在
  if (!existsSync(root)) return [];
  return readdirSync(root).filter((file) => {
    // 下划线开头的要忽略
    if (file.charAt(0) === "_" || file === "debug.log") return false;
    return true;
  });
}
let routes = getRoutes({ root: absPagesPath });
module.exports = routes;
