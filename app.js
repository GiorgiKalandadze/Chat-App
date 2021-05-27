const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser) 
app.use(express.static(__dirname + '/view'));
const port = 6000;


app.get('/*',  (req, res) => {
    
});


app.listen(Config.port, () => {
    console.log(`Search app listening on port ${port}!`);
});
