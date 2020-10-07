/* eslint-disable @typescript-eslint/no-var-requires */
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
    entry: "./src/client/runnable.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
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
        ],
    },
    devtool: "eval-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].[hash].bundle.js",
        path: path.resolve(__dirname, "dist/bundle/"),
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new BrowserSyncPlugin({
            // browse to http://localhost:3000/ during development,
            // ./public directory is being served
            host: "localhost",
            port: 3000,
            server: {
                baseDir: ["dist/bundle/"],
            },
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
