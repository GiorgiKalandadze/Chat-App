const path = require('path');

module.exports = {
  entry: './public/components/chat-app.js',
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/bundle'), 
  },
};