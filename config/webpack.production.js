const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve, join } = require("path");
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin");
const notifier = require("node-notifier");
const WorkboxPlugin = require('workbox-webpack-plugin');
const port = 3003;
module.exports = {
  devServer: {
    historyApiFallback: true,
    static: {
      directory: join(__dirname, '../dist'),
    },
    hot: true,
    port,
  },
  stats: 'errors-only',
  output: {
    publicPath: '/',
    //如果是通过loader 编译的 放到scripts文件夹里 filename
    filename: 'scripts/[name].bundle.js',
    //如果是通过'asset/resource' 编译的
    assetModuleFilename: 'images/[name].[ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: './public/favicon.ico',
      template: resolve(__dirname, '../src/index-product.html'),
    }),
    new WorkboxPlugin.GenerateSW({
      // Service Worker 文件输出路径
      swDest: 'service-worker.js',

      // 跳过等待，直接激活新 Service Worker
      skipWaiting: true,
      // 立即控制所有已打开的页面
      clientsClaim: true,

      // 预缓存的文件
      // Webpack 会自动将打包后的资源加入预缓存，无需手动指定
      // 但你可以排除某些文件
      exclude: [/\.map$/, /manifest\.json$/], // 排除 source map 和 manifest 文件

      // 如果是单页应用，设置导航回退页面
      navigateFallback: '/index-product.html',
      // 排除某些路径不使用回退（比如 API 请求）
      navigateFallbackDenylist: [/^\/api/],

      // 运行时缓存策略
      runtimeCaching: [
        {
          // 缓存图片文件
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst', // 缓存优先策略
          options: {
            cacheName: 'images', // 缓存名称
            expiration: {
              maxEntries: 50, // 最多缓存 50 个文件
              maxAgeSeconds: 30 * 24 * 60 * 60, // 缓存 30 天
            },
          },
        },
        {
          // 缓存 API 请求
          urlPattern: /^https:\/\/api\.example\.com/,
          handler: 'StaleWhileRevalidate', // 陈旧时重新验证策略
          options: {
            cacheName: 'api', // 缓存名称
            expiration: {
              maxEntries: 20, // 最多缓存 20 个响应
            },
          },
        },
      ],

      // 清理旧的缓存
      cleanupOutdatedCaches: true,
    }),
  ],
};
