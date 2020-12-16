const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cwd = process.cwd();

module.exports = {
  mode: "development",
  entry: "./src/.umi2/umi.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/",
  },

  devtool: false,
  resolve: {
    alias: {
      "@": path.join(cwd, "src"),
    },
  },
  devServer: {
    historyApiFallback: {
      index: "index.html",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/.umi2/index.html",
    }),
  ],
};
