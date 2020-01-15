const path = require('path');
const yargs = require('yargs');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = yargs.argv.mode !== 'production';
console.log('模式：' + yargs.argv.mode);
module.exports = {
    mode: devMode,
    context: path.resolve(__dirname, './src'),
    entry: {
        index: './index.js'
    },
    output: {
        path: path.resolve(__dirname, './docs/'),
        filename: devMode ? 'js/[name].js' : 'js/[name].[hash:8].js'
    },
    optimization: {
        minimize: !!devMode,
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                lib: {
                    name: 'lib',
                    chunks: 'initial',
                    test: /[\\/](node_modules)[\\/]/
                }
            }
        }
    },
    resolve: {
        alias: {
            lib: path.resolve(__dirname, './src/lib')
        },
        extensions: ['.js', '.json']
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties']
                    }
                }
            }, {
                test: /\.(png|jpg|gif|bmp|jpeg|ico)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'img/[name].[hash:8].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash:8].css'
        }),
        new HtmlWebpackPlugin({
            chunks: ['lib', 'index'],
            filename: 'index.html',
            template: '../public/index.html',
            chunksSortMode: 'dependency'
        }),
        new CopyWebpackPlugin([{
            from: '../public/favicon.ico',
            to: './'
        },{
            from: './images/model.png',
            to: './images/'
        }]),
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './src/'),
        port: 9090,
        historyApiFallback: true,
        inline: true,
        hot: true,
        proxy: {
            '/api': 'http://127.0.0.1:8080/'
        }
    }
};
