var score = 0;
var player = new Array();
player[1] = 0;
player[2] = 0;
var current = 1;
var turn = 1;
var next = false;

function endTurn() {
    player[current] += score;
    var turnRes = document.createTextNode(turn + ") " + score + " points. Total: " + player[current]);
    document.getElementById("player" + current).appendChild(turnRes);
    document.getElementById("player" + current).appendChild(document.createElement('br'));
    document.getElementById("currentRoll").innerHTML = "";
    document.getElementById("turnScore").innerHTML = "";
    document.getElementById("holdBut").style.display = "block";
    document.getElementById("rollBut").setAttribute('value', 'Roll');    
    if (player[current] > 100) {
	var win = document.createElement('h1');
	win.innerHTML = "Player " + current + " wins!!!";
	win.setAttribute('id', 'winner');
	document.getElementById("currentPlayer").style.display = "none";
	document.getElementById("holdBut").style.display = "none";
	document.getElementById("rollBut").style.display = "none";
	document.getElementById("container").appendChild(win);
	return;
    }

    document.getElementById("holdBut").style.display = "block";
    document.getElementById("rollBut").setAttribute('value', 'Roll');    

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

function roll() {
    if (next) {
	endTurn();
    }

    var dice1 = Math.floor((Math.random()*6)+1);
    var dice2 = Math.floor((Math.random()*6)+1);
    
    var roll = document.createTextNode(dice1 + " and " + dice2);
    
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
	document.getElementById("holdBut").style.display = "none";
	document.getElementById("turnScore").innerHTML = "";
	document.getElementById("rollBut").setAttribute('value', 'Roll');    
	next = true;
	return;
    }

    document.getElementById("rollBut").setAttribute('value', 'Roll Again');
    document.getElementById("currentRoll").appendChild(roll);
    document.getElementById("currentRoll").appendChild(document.createElement('br'));
    document.getElementById("turnScore").innerHTML = score;
}