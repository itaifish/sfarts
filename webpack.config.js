/* eslint-disable @typescript-eslint/no-var-requires */
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
    entry: "./src/frontend/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                query: {
                    name: "[name].[ext]",
                    outputPath: "./assets",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devtool: "eval-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist/bundle/"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/frontend/index.html",
        }),
        new BundleAnalyzerPlugin(),
    ],
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks: "all",
        },
    },
};
