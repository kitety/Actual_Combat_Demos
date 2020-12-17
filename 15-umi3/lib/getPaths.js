const { existsSync, statSync } = require("fs");
let { join } = require("path");
// 是否目录存在
function isDirectoryAndExist(path) {
  // 路径的文件是否存在 并且是否为目录
  return existsSync(path) && statSync(path).isDirectory();
}

// 工作路径 current working directory \15-umi3
let cwd = process.cwd();
// src目录的绝对路径
let absSrcPath = cwd;
// 目录存在就指向src目录
if (isDirectoryAndExist(join(absSrcPath, "src"))) {
  absSrcPath = join(absSrcPath, "src");
}

// pages的目录
let absPagesPath = join(absSrcPath, "pages");

// 临时文件夹名
let tmpDir = ".umi3";
// 临时路径
let absTmpPath = join(absSrcPath, tmpDir);

module.exports = { absSrcPath, absPagesPath, absTmpPath, tmpDir };
