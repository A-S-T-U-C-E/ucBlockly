/**
 * @packageDocumentation Webpack configuration file.
 * @author Blockly Team (https://github.com/google/blockly-samples/tree/master/examples/sample-app-ts)
 * @author scanet@libreduc.cc (Sébastien Canet)
 */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Base config that applies to either development or production mode.
let config = {
  entry: "./src/index.ts",
  output: {
    // Compile the source files into a bundle.
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/bundle"),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: "./build",
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new MonacoWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./node_modules/blockly/media"),
          to: path.resolve(__dirname, "docs/media"),
        },
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "docs"),
        },
      ],
    }),
  ],
};

module.exports = (_env, argv) => {
  if (argv.mode === "development") {
    config.output.path = path.resolve(__dirname, "build");
    config.devtool = "eval-cheap-module-source-map";

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve("source-map-loader")],
      enforce: "pre",
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map/];
  }
  return config;
};
