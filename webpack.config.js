const { Configuration } = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")


/**
 * @type {Configuration}
 */
const config = {
    mode: "development",
    entry: './src/main.ts', //入口文件
    module:{
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.less$/, //解析 less
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.css$/, //解析css
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.ts$/,  //解析ts
                loader: "ts-loader",
                options: {
                    configFile: path.resolve(process.cwd(), 'tsconfig.json'),
                    appendTsSuffixTo: [/\.vue$/]
                },
            }
        ]
    },
    output: {
        filename: "[hash].js",
        path: path.resolve(__dirname, 'dist'), //出口文件
        clean: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.ts', '.vue', '.json'],
    },
    stats: "errors-only",//去掉无用提示
    devServer: {
        port: 9001,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new VueLoaderPlugin(), //vue-loader插件
        new FriendlyErrorsWebpackPlugin(
            {
                compilationSuccessInfo: {
                    messages: ['Your application is running here http://localhost:8080'],
                }
            }
        ) //友好的错误提示
    ],
    // externals: {
    //     vue: 'Vue',
    // }
}

module.exports = config;