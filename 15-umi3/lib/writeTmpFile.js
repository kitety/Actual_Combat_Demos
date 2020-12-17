let mkdirp = require("mkdirp");
let { writeFileSync } = require("fs");
let { dirname, join } = require("path");
let { absTmpPath } = require("./getPaths");

/**
 * 向临时文件夹写入文件
 * @param {path} 目录
 * @param {content} 内容
 */
function writeTmpFile({ path, content }) {
  // 写入的绝对路径
  const absPath = join(absTmpPath, path);
  // 保证次路径的文件夹是存在的  不存在就先创建
  mkdirp.sync(dirname(absPath));
  // 写入文件
  writeFileSync(absPath, content, "utf8");
}

module.exports = writeTmpFile;
