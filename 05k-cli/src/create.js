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
};

// 封装loading
// 返回一个函数
const waitFnLoading = (fn, message) => async (...args) => {
  const spinner = ora(message);
  spinner.start();
  const result = await fn(...args);
  spinner.succeed();
  return result;
};
// 抓取tag列表
const fetchTagList = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`);
  return data;
};

const download = async (repo, tag) => {
  let api = `zhu-cli/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  console.log('dest', dest);
  await downloadGit(api, dest);
  return dest; // 显示下载的目录
};

module.exports = async (projectName) => {
  console.log('projectName', projectName);
  try {
    let repos = await waitFnLoading(fetchRepoList, 'fetching template...')();
    repos = repos.map((i) => i.name);
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      message: 'please choose a template to create project',
      choices: repos,
    });
    console.log(repo);
    // 通过当前选择的项目，拉取对应的版本
    // 获取对应的版本号
    let tags = await waitFnLoading(fetchTagList, 'fetch tags')(repo);
    tags = tags.map((i) => i.name);
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      message: 'please choose tags to create project',
      choices: tags,
    });
    // 把模板放到一个临时目录存放
    const result = await waitFnLoading(download, 'downloading template...')(repo, tag);
    console.log(result);
    // 拿到下载的目录，直接拷贝当前执行的目录下即可 ncp
    // 有的时候用户可以定制下载模板中的内容，拿package.json文件为例，用户可以根据提示给项目命名、
    // 设置描述等，生成最终的package.json文件 ask.js网址：https://github.com/zhu-cli/vue-template/blob/master/ask.js
    // 如果有ask.js文件直接下载
    if (!fs.existsSync(path.join(result, 'ask.js'))) {
      // 复杂的需要模板熏染 渲染后再拷贝
      // 把template下的文件 拷贝到执行命令的目录下
      // 在这个目录下 项目名字是否已经存在 如果存在示当前已经存在
      await ncp(result, path.resolve(projectName));
    } else {
      // 复杂的模板  把git上的项目下载下来，如果有ask文件就是一个复杂的模板，我们需要用户选择，选择后编译模板
      // metalsmith--模板编译需要这个包
      // 需要渲染模板的接口：https://github.com/zhu-cli/vue-template/blob/master/package.json

      // 1.用户填信息
      await new Promise((resolve, reject) => {
        // 如果你传入路径，默认遍历当前路径下的src文件夹
        metalsmith(__dirname)
          .source(result)
          .destination(path.resolve(projectName))
          .use(async (files, metal, done) => {
            // eslint-disable-next-line global-require
            const args = require(path.join(result, 'ask.js'));
            const obj = await inquirer.prompt(args);
            const meta = meta.metadata(args);
            Object.assign(meta, obj);
            // eslint-disable-next-line no-param-reassign
            delete files['ask.js'];
            done();
          })
          .use((files, metal, done) => {
            const obj = meta.metadata(args);
            Reflect.ownKeys(files).forEach(async (file) => {
              // 是要处理的文件
              if (file.includes('js') || file.includes('json')) {
                let content = files[file].content.toString();// 文件内容
                if (content.includes('<%')) {
                  content = await render(content, obj);
                  // eslint-disable-next-line no-param-reassign
                  files[file].content = Buffer.from(content);
                }
              }
            });
            // 2.让用户填写的信息取渲染模板
            // 根据用户新的输入 下载模板
            console.log(metal.metadata());
            done();
          })
          .build((err) => {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
      });
    }
  } catch (e) {
    console.log(e.code);
    console.log(e);
    process.exit();
  }
};
