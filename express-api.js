var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//ROUTES

// /list
app.get('/list', function(req, res, next) {

});






app.get('/', function(req, res, next) {
    res.send('Running');
});

app.use(function(err, req, res, next) {
    console.log('ERR', err);
    res.status(err.status || 500);
    res.send('Error ');
});

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '!');
});
