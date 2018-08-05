module.exports = {
  mode: "development",
  entry: './main/static/app.jsx',
  output: {
    path: __dirname+'/main/static',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
         test: /\.jsx$/,
         exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
        plugins: ["transform-react-jsx"] // babelのtransform-react-jsxプラグインを使ってjsxを変換
      }
      }
    ]
  }
}
