Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

var SIMULATION_SPEED = 100;

$(document).ready(function () {
	var board = createBoard(100, 100);
	drawBoard(board);

	window.setInterval(function () {
		board = updateBoard(board);
		drawBoard(board);
		console.log('iteration');
	}, SIMULATION_SPEED);

	console.log(board);
});

function createBoard(height, width) {
	if (!height) {
		var height = Math.ceil($('#world').height());
	}
	if (!width) {
		var width = Math.ceil($('#world').width());
	}
	var board = make2dArray(height, width);

	return board;
}

function make2dArray(height, width) {
	var grid = _.map(_.range(width), function(column) {
		return _.map(_.range(height), function (columnCell) {
			return _.random(0, 1);
			// return 0;
		});
	});
	// grid = testAcorn(grid);
	return grid;
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


function testSimple(grid) {
	var midWidth = Math.round(getWidth(grid) / 2);
	var midHeight = Math.round(getHeight(grid) / 2);

	grid[midWidth][midHeight] = 1;
	// grid[midWidth + 1][midHeight] = 1;
	// grid[midWidth + 1][midHeight + 2] = 1;
	// grid[midWidth + 3][midHeight + 1] = 1;
	// grid[midWidth + 4][midHeight] = 1;
	// grid[midWidth + 5][midHeight] = 1;
	// grid[midWidth + 6][midHeight] = 1;
	return grid;
}

// http://stackoverflow.com/a/817050
function copyArray(array) {
	return $.extend(true, [], array);
}

function updateBoard(board) {
	var newBoard = copyArray(board);
	for (var i = 0; i < getHeight(board); i++) {
		for (var j = 0; j < getWidth(board); j++) {
			var neighborCount = countNeighbors(board, j, i);
			if (neighborCount < 2 || neighborCount > 3) {
				newBoard[j][i] = 0;
			}
			else {
				newBoard[j][i] = 1;
			}
		}
	}
	return newBoard;
}

function countNeighbors(board, x, y) {
	var neighborCount = 0;
	// right neighbor
	if (board[(x + 1).mod(getWidth(board))][y] > 0) {
		neighborCount += 1;
	}
	// right bottom
	if (board[(x + 1).mod(getWidth(board))][(y - 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	// bottom
	if (board[x][(y - 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	// left bottom
	if (board[(x - 1).mod(getWidth(board))][(y - 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	// left
	if (board[(x - 1).mod(getWidth(board))][y] > 0) {
		neighborCount += 1;
	}
	// left top
	if (board[(x - 1).mod(getWidth(board))][(y + 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	// top
	if (board[x][(y + 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	// right top
	if (board[(x + 1).mod(getWidth(board))][(y + 1).mod(getHeight(board))] > 0) {
		neighborCount += 1;
	}
	return neighborCount;
}

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
				canvasContext.fillStyle = 'rgb(255,0,0)';
				canvasContext.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
			else {
				console.log('live cell at ' + j + ' ' + i);
				canvasContext.fillStyle = 'rgb(0,255,0)';
				canvasContext.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
		}
	}
}

function getHeight(board) {
	return board[0].length;
}

function getWidth(board) {
	return board.length;
}

