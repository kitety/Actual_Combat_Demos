// create 创建项目
// 拉取所有的项目并且列出来，让用户选安装哪一个
// 拉取后显示所有的版本号

// https://api.github.com/orgs/zhu-cli/repos 获取组织下的仓库
const axios = require('axios');
const ora = require('ora');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const metalsmith = require('metalsmith'); // 遍历文件夹，找需不需要渲染
const { promisify } = require('util');
let downloadGit = require('download-git-repo');
let { render } = require('consolidate').ejs;
let ncp = require('ncp');
const { downloadDirectory } = require('./constants');

// 把异步的api转换为promise
downloadGit = promisify(downloadGit);
render = promisify(render);
ncp = promisify(ncp);

// 获取项目列表
const fetchRepoList = async () => {
  const { data } = await axios.get('https://api.github.com/orgs/zhu-cli/repos');
  return data;
}

// 封装loading
const waitLoading = (fn, message) => async(..args)=> {
  const spinner = ora(message);
  spinner.start()
  const result = await fn(...args);
  spinner.succeed()
  return result
}
// 抓取tag列表
