const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    option: path.join(__dirname, "src/option.tsx"),
    popup: path.join(__dirname, "src/popup/index.tsx"),
    "event-page": path.join(__dirname, "src/event-page.ts"),
    "chrome-extension-async": path.join(__dirname, "src/chrome-extension-async.js"),
    "content-script": path.join(__dirname, "src/content-script.tsx")
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // Creates style nodes from JS strings
          },
          {
            loader: "css-loader" // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      'ENV.API_KEY': JSON.stringify(require(path.join(__dirname, 'environments', `${process.env.NODE_ENV}.js`)).API_KEY),
    })
  ]
};
