const path = require('path');

module.exports = [{
mode: 'development',
entry: './src/war.js',
name: 'war',
output: {
  filename: 'war_main.js',
  path: path.resolve(__dirname, 'dist'),
},
module: {
    rules: [{
      test: /.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
      }
    }]
  }
}, {
    mode: 'development',
    entry: './src/health.js',
    name: 'health',
    output: {
      filename: 'health_main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
          test: /.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
          }
        }]
      }
  }, {
    mode: 'development',
    entry: './src/politic.js',
    name: 'politic',
    output: {
      filename: 'politic_main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
          test: /.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
          }
        }]
      }
  }, {
    mode: 'development',
    entry: './src/society.js',
    name: 'society',
    output: {
      filename: 'society_main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
          test: /.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
          }
        }]
      }
  }, {
    mode: 'development',
    entry: './src/tech.js',
    name: 'tech',
    output: {
      filename: 'tech_main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
          test: /.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
          }
        }]
      }
  }, {
    mode: 'development',
    entry: './src/economy.js',
    name: 'economy',
    output: {
      filename: 'economy_main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
          test: /.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
          }
        }]
      }
  }];
