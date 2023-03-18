const path = require("path");

module.exports = {
  mode: "production",
  //devtool: "inline-source-map",
  entry: {
    main: "./src/background/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    filename: "background.js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.background.json",
        },
      },
    ],
  },
};
