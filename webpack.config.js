const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dayjs = require('dayjs');
const getClientEnvironment = require('./env');

module.exports = (env, argv) => {
    const debug = (env && env.debug);
    // Get environment variables to inject into our app.
    const envVars = getClientEnvironment(argv.stage);
    const plugins = [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            staticVersion: dayjs().unix(),
            environment: process.env.NODE_ENV,
            env: envVars.raw,
            inject: false,
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
        new CopyWebpackPlugin([{
            from: 'node_modules/speech-rule-engine/lib/sre_browser.js',
            to: 'libs/speech-rule-engine/lib/sre_browser.js',
        }, {
            from: 'src/lib/google-signin/style.css',
            to: 'libs/google-signin/style.css',
        }, {
            from: 'static/microsoft-identity-association.json',
            to: '.well-known/microsoft-identity-association.json',
        }, {
            from: 'v2-preact/build/bundle.*.css',
            to: 'main.v2.css',
        }, {
            from: 'v2-preact/build/bundle.*.js',
            to: 'main.v2.js',
        }, {
            from: 'v2-preact/build/**/*.js',
            to: '[name].[ext]',
        }, {
            from: 'v2-preact/build/**/*.css',
            to: '[name].[ext]',
        }]),
    ];
    if (!debug) {
        plugins.push(new webpack.IgnorePlugin(/mathlive\/src\/mathlive.js/));
    }
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
                exclude: /node_modules/,
                loader: [
                    debug ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            camelCase: true,
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
                    /node_modules(\/|\\)react-toastify/,
                    /node_modules(\/|\\)bootstrap/,
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
