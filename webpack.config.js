const path = require('path');

module.exports = {
  entry: './view/components/chat-app.js',
  mode: "development",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'view/bundle'), 
  },
};