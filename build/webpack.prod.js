/**
 * @file
 * @author huangzongzhe
 * webpack 4.16.1
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装

// TODO: 热更新，浏览器同步组件
module.exports = {
  // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
  // production will remove the 'dead code'. Look at Tree Shaking
  mode: 'production',
  entry: {
    activity: './app/web/js/index.jsx',
  },
  output: {
    path: path.resolve('./app', ''), // equal to __diname + '/build'
    filename: 'public/js/[name].[hash:5].js',
  },

  resolve: {
    extensions: [ '.js', '.jsx', '.less' ],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ '@babel/preset-env', '@babel/preset-react' ],
        },
      },
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: 'AELF-[path][name]_[local]-[hash:base64:5]',
          },
        },
        'sass-loader',
        'postcss-loader',
      ],
    }, {
      test: /\.(png|svg|jpg|gif|ico)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: './public/assets/output',
          },
        },
      ],
    }],
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: [ 'activity' ],
      template: './app/web/page/index.tpl',
      filename: './view/index.tpl',
    }),
  ],
};
