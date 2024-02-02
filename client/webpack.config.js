const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  // Define the entry point where the bundle should start the graph dependency
  entry: {
    app: './src/index.js'
  },
  // Define the output dir for the bundle files and their respective filename
  output: {
    filename: '[name].[chunkhash].bundle.js',
    path: path.join(__dirname, 'dist')
  },
  // Define configuration props for the development server
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  // Define loaders for converting modules to respective JS or JSON representation
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use:{
          loader: 'html-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  // Define the list of plugins for some extra actions over the loaders
  plugins: [
    // Will include the generated bundles to the HTML page once they are generated
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // Creates separate CSS file for all CSS scripts included in the JS code 
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[hash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
    })
  ]
}

if (!isDevelopment) {
  config.optimization = {
    minimizer: [
      // Uglify JS code so we can generate a minified version
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      // Optimize CSS assets for production build
      new OptimizeCssAssetsPlugin({})
    ]
  }
}

module.exports = config;
