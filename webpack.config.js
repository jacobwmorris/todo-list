const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SingleEntryPlugin } = require("webpack");

module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    optimization: {
        usedExports: true
    },
    entry: {
        index: "./src/index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "To Do List",
            template: "./src/newsamplepage.html"
        }),
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "docs"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource', //Uses a built in asset module
            },
        ],
    },
};
