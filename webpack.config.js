const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  entry: "./src/index",
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components|build)/,
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  output: {
    filename: "index.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
  },
};
