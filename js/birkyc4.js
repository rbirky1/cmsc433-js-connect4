// Rachael Birky
// CMSC 433
// JavaScript: Connect 4 Game Mechanics

// lobal variables to record turn, player and AI toggle
var turn = 0;
var player;
var ai;
	var expireDate = new Date();
	expireDate.setDate(expireDate.getDate() + (365 * 10));
var color1, color2;

// Array representation of board; default values of zero
var board = new Array(6);
for (var i = 0; i < board.length; i++) {
    board[i] = new Array(7+1).join('0').split('').map(parseFloat);
}

// Event Handlers
document.getElementById("resetButton").onclick = resetScores;
document.getElementById("newGameButton").onclick = newGame;
document.getElementById("thisboard").onclick = function() {putPiece(event)};
document.getElementById("thisboard").onmousemove = function() {hoverPiece(event)};
document.getElementById("aiCheck").checked = true;


/*
 * resetScores
 * Reset the wins, losses, and ties to zero
 */
function resetScores() {
    document.getElementById("wins").innerHTML = 0;
    document.getElementById("losses").innerHTML = 0;
    document.getElementById("ties").innerHTML = 0;
    $.cookie("wins",0,{expires:expireDate});
    $.cookie("losses",0,{expires:expireDate});
    $.cookie("ties",0,{expires:expireDate});
};

function setColor1(c1){
color1 = c1;
alert(c1);
}

/* 
 * newGame
 * Clear and redraw the board; set AI to default (on)
 */
function newGame() {

    $('#picker1').colpick({
	onSubmit:function(hsb,hex,rgb,el,bySetColor){ color1 = "#"+hex; $(el).colpickHide();}
    });

    ai = document.getElementById("aiCheck").checked
    if (ai) { color2 = '#'+Math.floor(Math.random()*16777215).toString(16);} else{
    $('#picker2').colpick({
	onSubmit:function(hsb,hex,rgb,el,bySetColor){color2 = "#"+hex; $(el).colpickHide();}
    });
    }

if(!color1){color1="red";}
if(!color2){color2="black";}

    createBoard();
    turn = 0;
    for (var i = 0; i < board.length; i++) {
    	board[i] = new Array(7+1).join('0').split('').map(parseFloat);
    }

    var val = $.cookie("wins");
    if (val) {
	document.getElementById("wins").innerHTML = $.cookie("wins");
	document.getElementById("losses").innerHTML = $.cookie("losses");
	document.getElementById("ties").innerHTML = $.cookie("ties");
    } else {
	document.getElementById("wins").value = 0;
	document.getElementById("losses").value = 0;
	document.getElementById("ties").value = 0;
	$.cookie("wins", 0, { expires: expireDate });
	$.cookie("losses", 0, { expires: expireDate });
	$.cookie("ties", 0, { expires: expireDate });
    }


}

/* 
 * addWin
 * Increment the win counter
 */
function addWin() {
    document.getElementById("wins").innerHTML = parseInt(document.getElementById("wins").innerHTML) + 1;
    var wins = parseInt(document.getElementById("wins").innerHTML);
    $.cookie("wins",wins,{expires:expireDate});
}

/* 
 * addLoss
 * Increment the losses counter
 */
function addLoss() {
    document.getElementById("losses").innerHTML = parseInt(document.getElementById("losses").innerHTML) + 1;
var losses = parseInt(document.getElementById("losses").innerHTML);
    $.cookie("losses",losses,{expires:expireDate});
}

/* 
 * addTie
 * Increment the ties counter
 */
function addTie() {
    document.getElementById("ties").innerHTML = parseInt(document.getElementById("ties").innerHTML) + 1;
    var ties = parseInt(document.getElementById("ties").innerHTML);
    $.cookie("ties",ties,{expires:expireDate});
}

/* 
 * hoverPiece
 * Draw a piece (of the appropriate color) to highlight the current column
 */
function hoverPiece(e) {
    var context = document.getElementById(canvasId).getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.rect(0,0,canvasWidth,cellHeight);
    context.fill();

    pPx = getMouseXY(e);
    pRC = pixelsToRowColumn(pPx.x, pPx.y);
    determineColor();
    drawPiece(0, pRC.column, color);
}

/* 
 * putPiece
 * Add the piece to the board, and call the AI if activated
 * Checks for valid column choice
 */
function putPiece(e) {
    pPx = getMouseXY(e);
    pRC = pixelsToRowColumn(pPx.x, pPx.y);
    // ROWS ARE OFF BY ONE
    if (pRC.row < 1) {
	alert("Please select a space on the board!");
    } else if (findRow(pRC.column)==-1){
	alert("Sorry, that column is already full.");
    } else {
	determineColor();
	row = findRow(pRC.column);
	drawPiece(row+1, pRC.column, color);

	board[row][pRC.column] = player;

	//CHECK WIN
	result = evaluateBoard(row,pRC.column, player);

	if (result){
	    alert("You won!");
	    addWin();
	    newGame();
	} else if (isFull()){
	    alert("Tie!");
	    addTie();
	    newGame();
	} else {
	    turn++;
	    //if AI on, execute this
	    if(ai){randomAI();}
	}
    }
}

/* 
 * determineColor
 * Sets the color according to the current player
 */
function determineColor (){
    player = (turn%2)+1;
    //make custom color later
    if (player == 1){
	color = color1; //"#FF0000"
    } else {
	color = color2; //"#000000"
    }
}

/* 
 * findRow
 * Given a column, finds the next available row (spot)
 */
function findRow(c){
    for (var r=board.length-1;r>=0;r--){
	if (board[r][c] == 0)
	    return r;
    }
    return -1;
}

/* 
 * randomAI
 * Randomly generates a column and places a piece there
 */
function randomAI() {
    determineColor();

    do {
	column = Math.floor(Math.random() * 7);
	row = findRow(column);
    } while (board[row][column]!=0)
    
    board[row][column] = player;
    drawPiece(row+1, column, color);

    //CHECK WIN
    result = evaluateBoard(row,column, player);

    if (result){
	alert("You lost...");
	addLoss();
	newGame();
    }

    if (isFull()){
	alert("Tie!");
	addTie();
	newGame();
    }

    turn++;
}

/* 
 * isFull
 * Checks if the board is full, resulting in a tie
 */
function isFull() {
    // Check if the board is full
    for (var r=0; r<board.length; r++){
	for (var c=0; c<board[r].length; c++){
	    if (board[r][c] == 0){
		return false;
	    }
	}
    }
    return true;
}

/* 
 * evaluateBoard
 * Checks and returns true if there is a win for the current player
 */
function evaluateBoard(r,c,p) {

    /* 
     * checkRow
     * Checks the current row for 4 in a row
     */
    function checkRow() {
	var sum=0;
	for (var cx=0; cx<board[r].length; cx++){
	    if (board[r][cx] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	}
	return false;
    }

    /* 
     * checkCol
     * Checks the current column for 4 in a row
     */
    function checkCol() {
	var sum=0;
	for (var rx=0; rx<board.length; rx++){
	    if (board[rx][c] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	}
	return false;
    }

    /* 
     * checkDiagDR
     * Checks the diagonal from the given piece, down to the right
     */
    function checkDiagDR(){
	var sum=0;
	var rx=r;
	var cx=c;
	while (rx<board.length && cx<board[0].length){
	    if (board[rx][cx] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	    rx++; cx++;
	}
	return false;
    }

    /* 
     * checkDiagDL
     * Checks the diagonal from the given piece, down to the left
     */
    function checkDiagDL(){
	var sum=0;
	var rx=r;
	var cx=c;
	while (rx<board.length && cx>=0){
	    if (board[rx][cx] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	    rx++; cx--;
	}
	return false;
    }

    /* 
     * checkDiagUL
     * Checks the diagonal from the given piece, up to the left
     */
    function checkDiagUL(){
	var sum=0;
	var rx=r;
	var cx=c;
	while (rx>0 && cx>0){
	    if (board[rx][cx] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	    rx--; cx--;
	}
	return false;
    }

    /* 
     * checkDiagUR
     * Checks the diagonal from the given piece, up to the right
     */
    function checkDiagUR(){
	var sum=0;
	var rx=r;
	var cx=c;
	while (rx>0 && cx<board[0].length){
	    if (board[rx][cx] == p){
		sum+=1;
		if (sum==4) return true;
	    } else {
		sum=0;
	    }
	    rx--; cx++;
	}
	return false;
    }

    // Return true if there is 4 in a row vertically, horizontally, or diagonally
    var dia = (checkDiagUR() || checkDiagUL() || checkDiagDR() || checkDiagDL());
    return (checkCol() || checkRow() || dia);
}
