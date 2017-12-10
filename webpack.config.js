const path = require('path')
const webpack = require('webpack')

module.exports = ({
  outputPath,
  debug = process.env.NODE_ENV === 'production',
  port = process.env.PORT || 3000
}) => {
  const config = {
    entry: [
      `webpack-dev-server/client?http://localhost:${port}`,
      './src/main.js'
    ],

    output: {
      path: path.resolve(__dirname, outputPath, 'generated'),
      filename: debug ? 'main.js' : 'main-[hash].js',
      publicPath: '/generated/'
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015']
              }
            }
          ]
        }
      ]
    },

    plugins: [],

    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ]
    },

    devtool: 'source-map'
  }

  return config
}
