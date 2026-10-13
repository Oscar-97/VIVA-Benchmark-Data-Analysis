const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: "production",
  entry: "./Src/Scripts/Main.ts",
  output: {
    filename: "bundle.js",
    chunkFilename: "[name].js",
    path: __dirname + "/Dist",
    // Dist is committed, so remove what an earlier build left behind (renamed or removed chunks).
    clean: true,
  },
  target: 'web',
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
      // CSS handled by plugin.
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader to extract CSS into a separate file.
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // bootstrap-icons lists a woff2 and a woff font. Browsers use the first format that they
              // support (woff2, since 2016), so the woff copy, 235 KB inlined, is left out.
              url: { filter: (url) => !/\.woff(\?|#|$)/.test(url) },
            },
          },
        ],
      },
      {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/inline",
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, ''),
    },
    compress: true,
    port: 9000,
    hot: false,
    open: {
      target: ['/report.html']
    },
    devMiddleware: {
      publicPath: '/Dist/',
      writeToDisk: true,
   },
    watchFiles: ['Src/**/*', 'report.html'],
    client: {
      progress: true,
      overlay: false,
    },
    headers: {
      'Cache-Control': 'no-store',
    },
  },
};
