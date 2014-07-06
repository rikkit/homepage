var homepath = '\\..\\web';

var express = require('express');
var api = require('./api.js');

var app = express();

app.use(express.static(__dirname + homepath));
console.log(__dirname + homepath);

app.get('/api/all', api.all);

app.listen(80);