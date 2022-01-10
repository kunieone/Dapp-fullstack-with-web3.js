const Koa = require("koa");
const path = require("path");
const proxy = require("http-proxy-middleware");
const static = require("koa-static");
const fs = require("fs");
const Web3 = require("web3");
const app = new Koa();
const url = "http://127.0.0.1/"; // 后端服务器地址
const web3 = new Web3("HTTP://127.0.0.1:7545");

async function getBlockNumber() {
  const n = await web3.eth.getBlockNumber();
  console.log(n);
}
app.use(async (ctx, next) => {
  if (ctx.url.startsWith("/api")) {
    // 以api开头的异步请求接口都会被转发
    ctx.respond = false;
    return proxy({
      target: url, // 服务器地址
      changeOrigin: true,
      secure: false,
      // pathRewrite: {
      //   "^/api": "/webapp/api",
      // },
      /* ^^^
            上面这个pathRewrite字段不是必须的，
            你的开发环境和生产环境接口路径不一致的话，才需要加这个。
            */
    })(ctx.req, ctx.res, next);
  }
  // ...这里省略N个接口
  return next();
});

// 指定静态资源文件夹
app.use(static(path.join(__dirname, "../web/dist")));

// 指定首页
app.use(async (ctx) => {
  ctx.body = fs.readFile("../web/dist/index.html");
  console.log(ctx.body);
});

// 监听
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000...");
});
getBlockNumber()