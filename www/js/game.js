var num;
var socket;

window.onload = function() {
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    socket = io.connect();
    socket.on('id', function(data) {
	document.getElementById('id').innerHTML = data.message;
    });
    socket.on('new', function(data) {
	num = data.num;
	xmlhttp.open("GET","/newgame?num="+num,false);
	xmlhttp.send();
	document.getElementById("container").innerHTML=xmlhttp.responseText;
    });
    socket.on('updateRound', function(data) {
	var turn = data.turn;
	document.getElementById("player"+turn).innerHTML += (data.res);
	document.getElementById("container").innerHTML = (data.render);
    });
    socket.on('updateGo', function(data) {
	document.getElementById("currentRoll").innerHTML += data.message;
	document.getElementById("turnScore").innerHTML = data.score;
    });
    socket.on('find', function(data) {
	document.getElementById("container").innerHTML = data.message;
    });
    socket.on('disconnect', function(data) {
	document.getElementById("container").innerHTML = data.message;
	head1 = document.getElementById("player1").childNodes[0];
	head2 = document.getElementById("player2").childNodes[0];
	document.getElementById("player1").innerHTML = "";
	document.getElementById("player1").appendChild(head1);
	document.getElementById("player2").innerHTML = "";
	document.getElementById("player2").appendChild(head2);  
    });
}

function endTurn() {
    socket.emit('end');
}

function go() {
    socket.emit('go');
}   

function findGame() {
    socket.emit('findGame');
    head1 = document.getElementById("player1").childNodes[0];
    head2 = document.getElementById("player2").childNodes[0];
    document.getElementById("player1").innerHTML = "";
    document.getElementById("player1").appendChild(head1);
    document.getElementById("player2").innerHTML = "";
    document.getElementById("player2").appendChild(head2);  
}
