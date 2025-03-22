const merge = require('webpack-merge');
const argv = require('yargs-parser')(process.argv.slice(2));
const { resolve } = require('path');
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _modeflag = _mode === 'production' ? true : false;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const WebpackBar = require('webpackbar');
const { ThemedProgressPlugin } = require('themed-progress-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackBaseConfig = {
  entry: {
    main: resolve('src/index.tsx'),
  },
  output: {
    path: resolve(process.cwd(), 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[hash:8][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        include: [resolve(__dirname, 'src'), resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]',
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`,
    },
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        default: false,
        defaultVendors: false,
        commons: {
          name: 'chunk-commons',
          minChunks: 2,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true,
          filename: 'js/[name].[contenthash:8].js',
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
          filename: 'js/[name].[contenthash:8].js',
        },
        uiComponent: {
          name: 'chunk-components',
          test: /([\\/]node_modules[\\/]@mui[\\/].+\w)|(src[\\/]components[\\/]common)|([\\/]node_modules[\\/]@yideng[\\/]components)/,
          chunks: 'all',
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
          filename: 'js/[name].[contenthash:8].js',
        },
        ethersSDK: {
          name: 'chunk-web3-sdk',
          test: /[\\/]node_modules[\\/](ethers*\w|@ethersproject*\w|@web3-react*\w)/,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        reactLibs: {
          name: 'chunk-react-libs',
          test: /[\\/]node_modules[\\/](react|react.+\w)/,
          chunks: 'all',
          priority: 6,
          reuseExistingChunk: true,
          enforce: true,
        },
        otherVendors: {
          name: 'chunk-other-vendors',
          test: /[\\/]node_modules[\\/](?!(react|@mui|ethers|@ethersproject|@web3-react))/,
          chunks: 'all',
          priority: 0,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve('src/'),
      '@components': resolve('src/components'),
      '@hooks': resolve('src/hooks'),
      '@pages': resolve('src/pages'),
      '@layouts': resolve('src/layouts'),
      '@assets': resolve('src/assets'),
      '@states': resolve('src/states'),
      '@service': resolve('src/service'),
      '@utils': resolve('src/utils'),
      '@lib': resolve('src/lib'),
      '@constants': resolve('src/constants'),
      '@connections': resolve('src/connections'),
      '@abis': resolve('src/abis'),
      '@types': resolve('src/types'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
    fallback: {
      // stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false,
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
    }),
    new ThemedProgressPlugin(),
  ],
  devServer: {
    port: 8889,
    host: '127.0.0.1',
  },
};

webpackBaseConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info',
  })
);

module.exports = merge.default(webpackBaseConfig, _mergeConfig);
