import serve from "rollup-plugin-serve";
/**
 * rollup 可以帮忙打包es6的模块化语法
 */
export default {
  input: "./src/single-spa.js",
  output: {
    file: "./lib/umd/single-spa.js",
    // 挂在window上
    format: "umd",
    name: "singleSpa",
    sourcemap: true,
  },
  plugins: [
    serve({
      openPage: "./index.html",
      contentBase: "",
      port: 3000,
    }),
  ],
};
