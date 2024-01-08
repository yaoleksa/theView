const path = require('path');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.output
});

let fn;

readline.question('Enter filename: ', filename => {
  fn = filename;
  readline.close();
});

module.exports = {
mode: 'development',
entry: `./src/${fn}.js`,
output: {
  filename: `main_${fn}.js`,
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
};
