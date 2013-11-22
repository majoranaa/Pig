function endTurn(game, id, socket, app, clients) {
    if (game.turn == game[id].num) {
	game[id].total += game[id].score;
    }

    var turnRes = ("<br>" + game.turns + ") " + game[id].score + " points. Total: " + game[id].total);
    var state;
    if (game[id].score == -1) {
	game[id].score = 0;
	if (game[id].total == -1) {
	    state = 0;
	    game[id].total = 0;
	} else {
	    state = 1;
	}
    }
    if (game[id].total > 100) {
	state = 2;
    }
    app.render('game',
	       {num:game[id].num,
		turn:game.turn,
		state:state
	       },
	       function(err, html) {
		   socket.socket(id).emit('updateRound',
					  {render:html,
					   turn:game.turn,
					   res:turnRes});
	       });
    app.render('game',
	       {num:game[game[id].opponent].num,
		turn:game.turn,
		state:state
	       },
	       function(err, html) {
		   socket.socket(game[id].opponent).emit('updateRound',
							    {render:html,
							     turn:game.turn,
							     res:turnRes});
	       });

    if (game.turn == 2 ) {
	game.turns++;
	game.turn = 1;
    } else {
	game.turn = 2;
    }
    game[id].score = 0;
	/*
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
    next = false;    */
}

function go(game, id, socket, app, clients) {
    var dice1 = Math.floor((Math.random()*6)+1);
    var dice2 = Math.floor((Math.random()*6)+1);
    
    if (dice1 == 1 && dice2 == 1) {
	game[id].score = -1;
	game[id].total = -1;
	endTurn(game, id, socket, app, clients);
	return -1;
	/*	document.getElementById("currentRoll").innerHTML = "Oh that sucks. You rolled two ones. Your total score is now zero. Other player now proceed";*/
    } else if (dice1 == 1 || dice2 == 1) {
	game[id].score = -1;
	endTurn(game, id, socket, app, clients);
	return -1;
	/*	document.getElementById("currentRoll").innerHTML = "Nice try. You rolled a one. Your turn score is now zero. Other player now proceed";*/
    } else {
	game[id].score += (dice1 + dice2);
    }

    return [dice1, dice2];
    
    /*if (game[id].score == 0) {
	hold.style.display = "none";
	document.getElementById("turnScore").innerHTML = "";
	roll.setAttribute('value', 'Roll');    
	next = true;
	return;
    }*/
    
/*    roll.setAttribute('value', 'Roll Again');
    document.getElementById("currentRoll").appendChild(trial);
    document.getElementById("currentRoll").appendChild(document.createElement('br'));
    document.getElementById("turnScore").innerHTML = score;*/
}   

exports.go = go;
exports.endTurn = endTurn;

