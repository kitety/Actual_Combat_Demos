let express = require("express");
let qs = require("qs");
let session = require("express-session");
let { readFile, writeFile } = require("./promiseFs");

let app = express();

// 跨域

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-Agent,X-Token,X-Legacy-Token,X-Legacy-Uid,X-Legacy-Device-Id,X-Legacy-New-Token,X-Request-Id"
  );
  req.method === "OPTIONS" ? res.send("ok") : next();
});

// 把post的参数转换为普通的对象存放在req.body上
app.use((req, res, next) => {
  // 不知道是不是需要区分方法
  if (req.method === "POST") {
    let str = "";
    req.on("data", (chunk) => {
      str += chunk;
    });
    res.on("end", () => {
      let obj = {};
      try {
        obj = JSON.parse(str);
      } catch (e) {
        obj = qs.parse(str);
      }
      req.body = obj;
      next();
    });
  } else {
    next();
  }
});

// 把读取数据的操作放到中间件处理
function setData(url, key, req, res, next) {
  readFile(url)
    .then((data) => {
      req[key] = JSON.parse(data);
      next();
    })
    .catch((err) => {
      res.status(505);
      res.send("505");
    });
}

// 轮播图
app.use((req, res, next) => {
  setData("./json/banner.json", "banner", req, res, next);
});

app.use(
  session({
    // 在这个中间件之后会多一个session属性
    name: "qqq", // 默认  connect.sid
    secret: "myqqq", // session会根据 这个属性 和后端种在session的属性名 来生成对应的字段
    saveUninitialized: false, //无论有没有session cookie，每次请求都设置个session cookie  默认标识为 connect.sid
    resave: false, //是否每次请求都重新设置session cookie
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, //cookie从创建到过期所能存在的时间，以秒为单位
    },
  })
);

app.get("/banner", (req, res) => {
  res.send({
    code: 0,
    data: req.banner.list,
  });
});
// 首页四张图和文字描述

app.use((req, res, next) => {
  setData("./json/publicClassList.json", "publicList", req, res, next);
});

app.get("/publicList", (req, res) => {
  res.send({
    code: 0,
    data: req.publicList,
  });
});

//多个课程数据
app.use((req, res, next) => {
  setData("./json/classList.json", "classList", req, res, next);
});
app.get("/classList", (req, res) => {
  res.send({
    code: 0,
    data: req.classList,
  });
});
app.get("/", (req, res) => {
  res.send({
    code: 0,
    data: "ok",
  });
});

app.listen(3000, function () {
  console.log("后端接口服务 起于 3000");
});
