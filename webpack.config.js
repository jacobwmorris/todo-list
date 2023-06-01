const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { SingleEntryPlugin } = require("webpack");

module.exports = {
    mode: "production",
    optimization: {
        usedExports: true
    },
    entry: {
        index: "./src/index.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "To Do List",
            template: "./src/samplepage.html"
        }),
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
