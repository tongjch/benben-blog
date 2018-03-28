var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body',
    hash: true,
    title: 'benben-blog'
})

module.exports = {
    entry: [
        './src/index.js'
    ],
    devtool: "source-map",
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'dist/js/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/},
            {
                test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader?minimize"
            })
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9]+)?$/,
                loader: 'url-loader?limit=1000&name=dist/fonts/[name].[hash:6].[ext]'
            },
            {
                test: /\.(png|jpg|gif)(\?[a-z0-9]+)?$/,
                loader: 'url-loader?limit=1000&name=dist/img/[name].[hash:8].[ext]'
            }
        ]
    },
    plugins: [HtmlWebpackPluginConfig,
        new UglifyJSPlugin({
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句，可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            },
            output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
            }
        }),
        new ExtractTextPlugin('dist/css/[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })]
}