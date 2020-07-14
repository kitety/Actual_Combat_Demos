let fs = require("fs");
let obj = {};
//读文件
["readFile", "readdir"].forEach((item) => {
  obj[item] = function (url, encoding = null) {
    if (/\.(js|css|html|txt|md)$/.test(url)) {
      encoding = "utf-8";
    }
    return new Promise((res, rej) => {
      fs[item](url, encoding, (err, data) => {
        if (!err) {
          res(data);
        } else {
          rej(err);
        }
      });
    });
  };
});
["mkdir", "rmdir", "unlink"].forEach((item) => {
  obj[item] = function (url) {
    return new Promise((res, rej) => {
      fs[item](url, (err) => {
        if (!err) {
          res();
        } else {
          rej(err);
        }
      });
    });
  };
});
//写文件
["writeFile", "appendFile"].forEach((item) => {
  obj[item] = function (url, data, encoding = null) {
    if (/\.(js|css|html|txt|md)$/.test(url)) {
      encoding = "utf-8";
    }
    return new Promise((res, rej) => {
      fs[item](url, data, encoding, (err) => {
        if (!err) {
          res();
        } else {
          rej(err);
        }
      });
    });
  };
});
//复制文件
obj.copyFile = function (oldUrl, newUrl) {
  return new Promise((res, rej) => {
    fs.copyFile(oldUrl, newUrl, (err) => {
      if (!err) {
        res();
      } else {
        rej(err);
      }
    });
  });
};
module.exports = obj;
