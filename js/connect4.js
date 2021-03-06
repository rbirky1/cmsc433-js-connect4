// ID of game canvas 
// Replace with whatever ID you give to the canvas element
var canvasId = "thisboard";

// Dimensions of canvas on which board is drawn
var canvasHeight = 490;
var canvasWidth = 490;

// Number of rows and columns in connect 4 grid
var rows = 6;
var columns = 7;

// Cell dimensions in game grid
var cellWidth = canvasWidth / columns;
var cellHeight = canvasHeight / (rows + 1);

/*
 * pixelsToRowColumn
 * 
 * Turn a set of (x, y) pixel coordinates to (row, column)
 * coordinates on the game grid.
 */
function pixelsToRowColumn(x, y)
{
	var row = Math.floor(y / cellHeight);
	var column = Math.floor(x / cellWidth);

	return {row: row, column: column};
}

/*
 * rowColumnToPixels
 * 
 * Turn a set of (row, column) coordinates in the game
 * grid to (x, y) pixel coordinates.
 */
function rowColumnToPixels(row, column)
{
	var x = column * cellWidth + cellWidth / 2;
	var y = row * cellHeight + cellHeight / 2;

	return {x: x, y: y};
}

/*
 * drawPiece
 * 
 * Draw a piece with the given color at the specified
 * row and column in the game grid.
 *
 * Note: left column is 0, top row of yellow part is 1,
 *       row 0 is above the yellow part
 */
function drawPiece(row, column, color)
{
	// Figure out how/where to draw the piece
	var context = document.getElementById(canvasId).getContext("2d");
	var radius = (canvasWidth / columns) / 2 - 5;
	var coordinates = rowColumnToPixels(row, column);

	// Draw the circle
	context.fillStyle = color;
	context.beginPath();
	context.arc(coordinates.x, coordinates.y, radius, 0, Math.PI * 2, true);
	context.fill();
}

/*
 * createBoard
 * 
 * Create an empty connect 4 board. 
 * Should be done onload, and whenever a new game is started.
 */
function createBoard()
{
	var context = document.getElementById(canvasId).getContext("2d");

	// Grid location and size
	var gridX = 0;
	var gridY = canvasHeight / columns;
	var gridWidth = canvasWidth;
	var gridHeight = (canvasHeight * rows) / columns;

	// Create grid
	context.fillStyle = "rgb(40, 40, 100)";
	context.fillRect(gridX, gridY, gridWidth, gridHeight);

	// Draw empty cells in game grid.
	for (var row = 0; row < rows; row++)
	{
		for (var col = 0; col < columns; col++)
		{
			drawPiece(row + 1, col, "white");
		}
	}
}

/*
 * getMouseXY
 * 
 * Get the (x, y) pixel coordinates of the mouse on the canvas.
 * HINT: Meant to be used in conjunction with a mousemove event.
 */
function getMouseXY(eventData)
{
	var rect = document.getElementById(canvasId).getBoundingClientRect();
	var x = eventData.clientX - rect.left;
	var y = eventData.clientY - rect.top;

	return {x: x, y: y};
}
