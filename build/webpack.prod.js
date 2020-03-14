/**
 * @file
 * @author huangzongzhe
 * webpack 4.16.1
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const {
  ROOT,
  getLessVariables
} = require('./utils');

// TODO: 热更新，浏览器同步组件
module.exports = {
  // When mode is production or not defined, minimize is enabled. This option automatically adds Uglify plugin.
  // production will remove the 'dead code'. Look at Tree Shaking
  // mode: 'production',
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
    },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: './public/assets/output',
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
        }, {
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: getLessVariables(
              path.resolve(ROOT, 'app/web/assets/less/_variables.less')
            ),
            javascriptEnabled: true,
          },
        }
        ]
      },],
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
    // new CleanWebpackPlugin(pathsToClean, cleanOptions),
    // ,
    // new BundleAnalyzerPlugin({
    // 	analyzerMode: 'server',
    // 	analyzerHost: '127.0.0.1',
    // 	analyzerPort: 8889,
    // 	reportFilename: 'report.html',
    // 	defaultSizes: 'parsed',
    // 	openAnalyzer: true,
    // 	generateStatsFile: false,
    // 	statsFilename: 'stats.json',
    // 	statsOptions: null,
    // 	logLevel: 'info'
    // })
  ],
};
