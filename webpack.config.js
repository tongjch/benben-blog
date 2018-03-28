var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
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
                use: "css-loader"
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
        new ExtractTextPlugin('dist/css/[name].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev')
        })]
}