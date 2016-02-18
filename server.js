var express = require('express');
var morgan = require('morgan');
var bodyParse = require('body-parser');

var port = process.env.PORT || 4568;

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/client'));

//bodyParse will be needed for chat later on
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json());


app.listen(port);
console.log('listening on ' + port);