var score = 0;
var player = new Array();
player[1] = 0;
player[2] = 0;
var current = 1;
var turn = 1;
var next = false;
var roll, hold;
var socket;

window.onload = function() {
    roll = document.getElementById('rollBut');
    hold = document.getElementById('holdBut');
    
    socket = io.connect('http://localhost:5000');
    socket.on('connect', function() {
	alert("Connected");
    });
    socket.on('id', function(data) {
	alert("Got id");
	document.getElementById('id').innerHTML = data.message;
    });

    roll.onclick = go();
    hold.onclick = endTurn();
}

function endTurn() {
    player[current] += score;
    var turnRes = document.createTextNode(turn + ") " + score + " points. Total: " + player[current]);
    document.getElementById("player" + current).appendChild(turnRes);
    document.getElementById("player" + current).appendChild(document.createElement('br'));
    document.getElementById("currentRoll").innerHTML = "";
    document.getElementById("turnScore").innerHTML = "";
    hold.style.display = "block";
    roll.setAttribute('value', 'Roll');    
    if (player[current] > 100) {
	var win = document.createElement('h1');
	win.innerHTML = "Player " + current + " wins!!!";
	win.setAttribute('id', 'winner');
	document.getElementById("currentPlayer").style.display = "none";
	hold.style.display = "none";
	roll.style.display = "none";
	document.getElementById("container").appendChild(win);
	return;
    }

    hold.style.display = "block";
    roll.setAttribute('value', 'Roll');    
    
    if (current == 1) {
	current = 2;
    } else {
	current = 1;
	turn++;
    }
    document.getElementById("currentPlayer").innerHTML = "Player " + current;
    score = 0;
    next = false;    
}

function go() {
    if (next) {
	endTurn();
    }
    
    var dice1 = Math.floor((Math.random()*6)+1);
    var dice2 = Math.floor((Math.random()*6)+1);
    
    var trial = document.createTextNode(dice1 + " and " + dice2);
    
    if (dice1 == 1 && dice2 == 1) {
	player[current] = 0;
	score = 0;
	document.getElementById("currentRoll").innerHTML = "Oh that sucks. You rolled two ones. Your total score is now zero. Other player now proceed";	
    } else if (dice1 == 1 || dice2 == 1) {
	score = 0;
	document.getElementById("currentRoll").innerHTML = "Nice try. You rolled a one. Your turn score is now zero. Other player now proceed";
    } else {
	score += (dice1 + dice2);
    }
    
    if (score == 0) {
	hold.style.display = "none";
	document.getElementById("turnScore").innerHTML = "";
	roll.setAttribute('value', 'Roll');    
	next = true;
	return;
    }

    roll.setAttribute('value', 'Roll Again');
    document.getElementById("currentRoll").appendChild(trial);
    document.getElementById("currentRoll").appendChild(document.createElement('br'));
    document.getElementById("turnScore").innerHTML = score;
}   
