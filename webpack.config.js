const path = require("path");

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000
  },
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
    filename: "app.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist")
  }
};
