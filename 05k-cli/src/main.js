const program = require('commander');
const path = require('path');
const { version } = require('./constants');

console.log(process.argv);// 当前进程的参数  zhu-cli --help运行出结果
// console.log(program);

// 多个指令命令的集合   运行zhu-cli create xx
const mapAction = {
  // 创建模板
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'lzk-cli create <project-name>',
    ],
  },
  // 配置文件
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'lzk-cli config set <k> <v>',
      'lzk-cli config get <k>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};
// 相当于Object.keys()循环创建命令
Reflect.ownKeys(mapAction).forEach((action) => {
  program.command(action)// 配置命令的名字
    .alias(mapAction[action].alias)// 命令别的名称
    .description(mapAction[action].description)// 描述
    .action(() => {
      if (action === '*') {
        console.log(mapAction[action].description);
      } else {
        console.log(action);
        // 运行zhu-cli create xxx  解析后是[node , zhu-cli  , create  , xxx]
        // eslint-disable-next-line global-require
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    });
});

program.on('--help', () => {
  console.log('\r\nExamples:');
  Reflect.ownKeys(mapAction).forEach((action) => {
    mapAction[action].examples.forEach((example) => {
      console.log(`    ${example}`);
    });
  });
});

// 运行lzk-cli --version结果为当前的版本
// 解析用户传过来的参数  lzk-cli --help 运行出来结果
program.version(version).parse(process.argv);
