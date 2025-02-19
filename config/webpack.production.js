const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve, join } = require("path");
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin");
const notifier = require("node-notifier");
const port = 3003;
module.exports = {
  devServer: {
    historyApiFallback: true,
    static: {
      directory: join(__dirname, "../dist"),
    },
    hot: true,
    port,
  },
  stats: "errors-only",
  output: {
    publicPath: "/",
    //如果是通过loader 编译的 放到scripts文件夹里 filename
    filename: "scripts/[name].bundle.js",
    //如果是通过'asset/resource' 编译的
    assetModuleFilename: "images/[name].[ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: "./public/favicon.ico",
      template: resolve(__dirname, "../src/index-product.html"),
    }),
  ],
};
