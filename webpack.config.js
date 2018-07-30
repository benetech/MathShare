
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const htmlWebpackPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

module.exports = env => {
    var debug = (env && env.debug);
    var plugins = [
        htmlWebpackPlugin,
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.DefinePlugin({
            DEBUG_MODE: debug
        })
    ];
    if (!debug) {
        plugins.push(new webpack.IgnorePlugin(/mathlive\/src\/mathlive.js/));
    }
    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader"
                        },
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                importLoaders: 1,
                                localIdentName: "[name]_[local]_[hash:base64]",
                                sourceMap: true,
                                minimize: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins
    }
};
