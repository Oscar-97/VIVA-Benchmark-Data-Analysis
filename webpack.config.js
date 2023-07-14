module.exports = {
  mode: "production",
  entry: "./Src/Scripts/Main.ts", // The entry point for your code
  output: {
    filename: "bundle.js", // The name of the bundled file
    path: __dirname + "/Dist", // The directory where the bundled file should be saved
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  optimization: {
    minimize: true
  },
};
