// 存放用户常量
const path = require('path');
const { version } = require('../package.json');

// 存储模板的位置，下载前先找到临时目录存放下载的文件

const downloadDirectory = path.resolve(__dirname, '../template/');
module.exports = {
  version, downloadDirectory,
};
