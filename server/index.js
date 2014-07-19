var homepath = '/../web';

var express = require('express');
var api = require('./api.js');
var path = require('path');

var app = express();

var path = path.normalize(__dirname + homepath);

app.use(express.static(path));
console.log(path);

app.get('/api/all', api.all);

var port = process.argv[2];
console.log('listening on port ' + port)
app.listen(port);
