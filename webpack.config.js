/**
 * Created by micha on 18.03.17.
 */
/**
 * Created by micha on 17.12.16.
 */
const path = require("path");
const webpack = require("webpack");

const cssDev = ["style-loader", "css-loader", "postcss-loader", "sass-loader"];

const config = {
    entry: "./index.js",
    output: {
        path: "/public",
        filename: "bundle.js",
        publicPath: "/"
    },
    module: {
        loaders: [
            {
                test: /(\.js$|\.jsx)/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: cssDev
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: "json"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true, // Use gzip compression
        historyApiFallback: true,
        hot: true,
        stats: "errors-only"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "window.jQuery": "jquery",
            jQuery: "jquery",
            $: "jquery",
            _: "lodash"
        })
    ],
    resolve: {
        extensions: [".js", ".json", ".jsx"]
    }
    // sassLoader: {
    //     data: "@import 'theme/_config.scss';",
    //     includePaths: [path.resolve(__dirname, "./modules")]
    // }
};

module.exports = config;
