var homepath = '\\..\\web';

var express = require('express');
var app = express();

app.use(express.static(__dirname + homepath));
console.log(__dirname + homepath);
app.listen(80);