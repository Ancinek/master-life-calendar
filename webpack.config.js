/**
 * Created by micha on 18.03.17.
 */
/**
 * Created by micha on 17.12.16.
 */
const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProd = process.env.NODE_ENV === "production"; // based on the constiable set in the terminal
const cssDev = ["style-loader", "css-loader", "postcss-loader", "sass-loader"];
const cssProd = ExtractTextPlugin.extract({
    use: ["css-loader", "postcss-loader", "sass-loader"],
    fallback: "style-loader"
});
const cssConfig = isProd ? cssProd : cssDev;


const config = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "public", "dist"),
        filename: "bundle.js",
        publicPath: "/dist/"
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
                use: cssConfig
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: "json"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]"
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
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            "window.jQuery": "jquery",
            jQuery: "jquery",
            $: "jquery",
            _: "lodash"
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: !isProd, // Turning it on/off based on the environment
            allChunks: true
        })
    ],
    resolve: {
        extensions: [".js", ".json", ".jsx"]
    }
};

module.exports = config;
