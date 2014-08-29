var express = require('express');
var cors = require('cors');
var api = require('./api.js');
var path = require('path');

var homepath = '/../web';
var path = path.normalize(__dirname + homepath);

var app = express();

app.use(cors());
app.use(express.static(path));
console.log(path);

app.get('/api/all', api.all);

var port = process.argv[2];
console.log('listening on port ' + port)
app.listen(port);
