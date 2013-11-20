var express = require('express');
var fs = require('fs');
var app = express();
var routes = require('./routes');


app.use(express.logger());
app.use(express.static(__dirname + '/www'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function(req, res) {
    res.render('index');
});

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
    console.log("Listening on " + port);
});

var io = require('socket.io').listen(server);
var clients = [];
io.sockets.on('connection', function(client) {
    console.log("New connection", client.id);
    clients.push(client.id);
});
