import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as wds from 'webpack-dev-server';

interface Config extends webpack.Configuration {
  devServer?: wds.Configuration;
}

const config: Config = {
  mode: 'development',
  entry: './gui/index.ts',

  plugins: [
    new HtmlWebpackPlugin({ template: './gui/index.ejs' }),
  ],

  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    historyApiFallback: true,
    compress: true,
    stats: 'minimal'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  },
}

export default config;