var express = require('express');
var fs = require('fs');
var app = express();
var routes = require('./routes');
var jade = require('jade');
var game = require('./game');

app.use(express.logger());
app.use(express.static(__dirname + '/www'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

app.get('/', routes.index);
app.get('/newgame', routes.newgame(games));

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
    console.log("Listening on " + port);
});

var io = require('socket.io').listen(server);
var clients = {};
var openIds = [];
var games = [];
var waiting = [];
var total = 1;

io.sockets.on('connection', function(client) {
    console.log("New connection", client.id);
    if (openIds.length > 0) {
	clients[client.id]={id:openIds.pop()};
    } else {
	clients[client.id]={id:total};
	total++;
    }
    client.emit('id', { message : "You are player id: " + 
			clients[client.id].id });
    if (waiting.length > 0) {
	var opp = waiting.pop();
	io.sockets.socket(client.id).emit('new', {num : 2});
	io.sockets.socket(opp).emit('new', {num : 1});
	var newOne = {score:0, total:0, opponent:client.id, num:1};
	var newTwo = {score:0, total:0, opponent:opp, num:2};
	var newGame = {};
	newGame[opp] = newOne;
	newGame[client.id] = newTwo;
	newGame.turn = 1;
	newGame.turns = 0;
	games.push(newGame);
	clients[client.id].game=games.length-1;
	clients[opp].game=games.length-1;
    } else {
	waiting.push(client.id);
    }
    
    client.on('go', function() {
	var currGame = games[clients[client.id].game];
	var rollRes = game.go(currGame, client.id, io.sockets, app, clients);
	if (rollRes == -1) {
	    return;
	} else {
	    var res = "<br>" + rollRes[0] + ", " + rollRes[1];
	    client.emit('updateGo', {message: res,
				     score: currGame[client.id].score});
	}
    });
    
    client.on('end', function() {
	var currGame = games[clients[client.id].game];
	game.endTurn(currGame, client.id, io.sockets, app, clients);
    });
    client.on('disconnect', function() {
	openIds.push(clients[client.id].id);	
	var currGame = games[clients[client.id].game];
	var oppId = (currGame[client.id].opponent);
	var wait = "Opponent disconnected. Waiting for next player..."
	io.sockets.socket(oppId).emit('disconnect', {message:wait});	
	if (waiting.length > 0) {
	    var opp = waiting.pop();
	    io.sockets.socket(oppId).emit('new', {num : 2});
	    io.sockets.socket(opp).emit('new', {num : 1});
	    var newOne = {score:0, total:0, opponent:oppId, num:1};
	    var newTwo = {score:0, total:0, opponent:opp, num:2};
	    var newGame = {};
	    newGame[opp] = newOne;
	    newGame[oppId] = newTwo;
	    newGame.turn = 1;
	    newGame.turns = 0;
	    games.push(newGame);
	    clients[oppId].game=games.length-1;
	    clients[opp].game=games.length-1;
	} else {
	    waiting.push(oppId);
	}
    });
    client.on('findGame', function() {
	if (waiting.length > 0) {
	    var opp = waiting.pop();
	    io.sockets.socket(client.id).emit('new', {num : 2});
	    io.sockets.socket(opp).emit('new', {num : 1});
	    var newOne = {score:0, total:0, opponent:client.id, num:1};
	    var newTwo = {score:0, total:0, opponent:opp, num:2};
	    var newGame = {};
	    newGame[opp] = newOne;
	    newGame[client.id] = newTwo;
	    newGame.turn = 1;
	    newGame.turns = 0;
	    games.push(newGame);
	clients[client.id].game=games.length-1;
	    clients[opp].game=games.length-1;
	} else {
	    waiting.push(client.id);
	    var wait = "Finding new player...";
	    client.emit('find', {message:wait});
	}
    });
}); 
