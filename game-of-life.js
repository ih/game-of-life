// Number of milliseconds between updates
var SIMULATION_SPEED = 250;
var X = 0;
var Y = 1;

$(document).ready(function () {
	var board = createBoard(200, 200);
	drawBoard(board);

	window.setInterval(function () {
		board = updateBoard(board);
		drawBoard(board);
	}, SIMULATION_SPEED);
});

/****
 * INITIALIZATION RELATED FUNCTIONALITY
 */

function createBoard(height, width) {
	if (!height) {
		height = Math.ceil($('#world').height());
	}
	if (!width) {
		width = Math.ceil($('#world').width());
	}
	var board = make2dArray(height, width);

	return board;
}

/****
 * LOGIC FOR STATE OF THE GAME
 */

function updateBoard(board) {
	var newBoard = copyArray(board);
	for (var i = 0; i < getHeight(board); i++) {
		for (var j = 0; j < getWidth(board); j++) {
			var neighborCount = countNeighbors(board, j, i);
			if (neighborCount === 3) {
				newBoard[j][i] = 1;
			}
			else if (neighborCount === 4){
			}
			else {
				newBoard[j][i] = 0;
			}
		}
	}
	return newBoard;
}

function countNeighbors(board, x, y) {
	var neighborPositions = getNeighborCoordinates(board, x, y);
	var neighborStates = _.map(neighborPositions, function (position) {
			return board[position[X]][position[Y]];;
	});
	return _.reduce(
		neighborStates, function (memo, num) {return memo + num;}, 0);
}

function getNeighborCoordinates(board, x, y) {
	var leftOfX = x === 0 ? getWidth(board) - 1 : x - 1;
	var rightOfX = x === getWidth(board) - 1 ? 0 : x + 1;
	var belowY = y === 0 ? getHeight(board) - 1: y - 1;
	var aboveY = y === getHeight(board) - 1 ? 0 :  y + 1;
	var coordinates = [
		[leftOfX, aboveY], [x, aboveY], [rightOfX, aboveY],
		[leftOfX, y], [x, y], [rightOfX, y],
		[leftOfX, belowY], [x, belowY], [rightOfX, belowY]
	];
	return coordinates;
}

/****
 * VISUALIZATION OF THE GAME STATE
 */

function drawBoard(board) {
	var windowHeight = Math.ceil($('#world').height());
	var windowWidth = Math.ceil($('#world').width());
	var cellHeight = Math.ceil(windowHeight / getHeight(board));
	var cellWidth = Math.ceil(windowWidth / getWidth(board));
	var canvasContext = document.getElementById('world').getContext('2d');
	canvasContext.canvas.width = windowWidth;
	canvasContext.canvas.height = windowHeight;
	for (var i = 0; i < getHeight(board); i++) {
		for (var j = 0; j < getWidth(board); j++) {
			if (board[j][i] === 0) {
				canvasContext.fillStyle = 'rgb(255,255,255)';
				canvasContext.fillRect(
					j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
			else {
				canvasContext.fillStyle = 'rgb(0,0,0)';
				canvasContext.fillRect(
					j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
		}
	}
}

/**
 * GENERAL UTILITY FUNCTIONALITY
 */

function make2dArray(height, width) {
	var grid = _.map(_.range(width), function(column) {
		return _.map(_.range(height), function (columnCell) {
			return _.random(0, 1);
		});
	});
	return grid;
}

function getHeight(board) {
	return board[0].length;
}

function getWidth(board) {
	return board.length;
}

// http://stackoverflow.com/a/817050
function copyArray(array) {
	return $.extend(true, [], array);
}

/****
 * SANITY CHECKS
 */

function testBar(grid) {
	var midWidth = Math.round(getWidth(grid) / 2);
	var midHeight = Math.round(getHeight(grid) / 2);

	grid[midWidth][midHeight] = 1;
	grid[midWidth][midHeight + 1] = 1;
	grid[midWidth][midHeight + 2] = 1;
}

function testAcorn(grid) {
	var midWidth = Math.round(getWidth(grid) / 2);
	var midHeight = Math.round(getHeight(grid) / 2);

	grid[midWidth][midHeight] = 1;
	grid[midWidth + 1][midHeight] = 1;
	grid[midWidth + 1][midHeight + 2] = 1;
	grid[midWidth + 3][midHeight + 1] = 1;
	grid[midWidth + 4][midHeight] = 1;
	grid[midWidth + 5][midHeight] = 1;
	grid[midWidth + 6][midHeight] = 1;
	return grid;
}
