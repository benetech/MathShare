const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getClientEnvironment = require('./env');

module.exports = (env, argv) => {
    const debug = (env && env.debug);
    // Get environment variables to inject into our app.
    const envVars = getClientEnvironment(argv.stage);
    const plugins = [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            environment: process.env.NODE_ENV,
            env: envVars.raw,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.DefinePlugin(envVars.stringified),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ];
    return {
        resolveLoader: {
            modules: [path.join(__dirname, 'node_modules')],
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /node_modules|src(\/|\\)assets(\/|\\)scss/,
                loader: [
                    debug ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                                exportLocalsConvention: 'camelCase',
                            },
                            sourceMap: debug,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: debug,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                include: [
                    /src(\/|\\)components/,
                ],
                use: [{
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]_[local]_[hash:base64]',
                        sourceMap: true,
                        minimize: true,
                    },
                },
                ],
            },
            {
                test: /\.(jpg|png|gif|pdf|ico)$/,
                include: /images/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                }],
            },
            {
                test: /\.css$/,
                include: [
                    /node_modules(\/|\\)bootstrap/,
                    /node_modules(\/|\\)react-toastify/,
                    /node_modules(\/|\\)antd/,
                    /node_modules(\/|\\)mathlive/,
                    /src(\/|\\)assets(\/|\\)scss/,
                    /src(\/|\\)lib/,
                    /src(\/|\\)styles/,
                ],
                use: [{
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                },
                ],
            },
            {
                test: /\.s(a|c)ss$/,
                include: [
                    /node_modules(\/|\\)bootstrap/,
                    /src(\/|\\)assets(\/|\\)scss/,
                ],
                loader: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: debug,
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
                        lessOptions: {
                            modifyVars: {
                                'primary-color': '#37345B',
                            },
                            javascriptEnabled: true,
                        },
                    },
                }],
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
                loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: [/node_modules/, /dist/, /src(\/|\\)lib/],
                loaders: ['eslint-loader'],
            },
            ],
        },
        devServer: {
            port: 3000,
        },
        plugins,
        resolve: {
            extensions: ['.js', '.css', '.scss'],
        },
    };
};
