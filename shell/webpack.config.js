const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // permet d'importer depuis 'shared/eventBus' dans tous les fichiers src/
      shared: path.resolve(__dirname, '../shared'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-react'] },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        mfe_product: 'mfe_product@http://localhost:3001/remoteEntry.js',
        mfe_cart:    'mfe_cart@http://localhost:3002/remoteEntry.js',
        mfe_reco:    'mfe_reco@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react:     { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
