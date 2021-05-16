import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as wds from 'webpack-dev-server';
import path from 'path';

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
    extensions: ['.ts', '.js'],
    alias: {
      '#router': path.resolve(__dirname, 'gui/services/Router'),
      '#services': path.resolve(__dirname, 'gui/services'),
      '#components': path.resolve(__dirname, 'gui/components'),
    }
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  },
}

export default config;