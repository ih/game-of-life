function memoize(f) {
	var memory = {};
	var memoized = function () {
		var args = Array.prototype.slice.call(arguments, 0);
		if (_.has(memory, args)) {
			return memory[args];
		}
		else {
			var ans = f.apply(this, args);
			memory[args] = ans;
			return ans;
		}
	};
	return memoized;
}

function mod(m, n) {
    return ((m % n) + n) % n;
}

var SIMULATION_SPEED = 1000;
var X = 0;
var Y = 1;

$(document).ready(function () {
	var board = createBoard();
	drawBoard(board);

	window.setInterval(function () {
		board = updateBoard(board);
		drawBoard(board);
	}, SIMULATION_SPEED);
});

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

function make2dArray(height, width) {
	var grid = _.map(_.range(width), function(column) {
		return _.map(_.range(height), function (columnCell) {
			return _.random(0, 1);
		});
	});
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


var memory = {};
function getNeighborCoordinates(board, x, y) {
	if (_.has(memory, [x, y])) {
		return memory[[x, y]];
	}
	else {
		var leftOfX = x === 0 ? getWidth(board) - 1 : x - 1;
		var rightOfX = x === getWidth(board) - 1 ? 0 : x + 1;
		var belowY = y === 0 ? getHeight(board) - 1: y - 1;
		var aboveY = y === getHeight(board) - 1 ? 0 :  y + 1;
		var coordinates = [
			[leftOfX, aboveY], [x, aboveY], [rightOfX, aboveY],
			[leftOfX, y], [rightOfX, y],
			[leftOfX, belowY], [x, belowY], [rightOfX, belowY]
		];
		memory[[x, y]] = coordinates;
		return coordinates;
	}
}

// getNeighborCoordinates = memoize(getNeighborCoordinates);

function countNeighbors(board, x, y) {
	var neighborPositions = getNeighborCoordinates(board, x, y);
	var neighborStates = _.map(neighborPositions, function (position) {
			return board[position[X]][position[Y]];;
	});
	return _.reduce(
		neighborStates, function (memo, num) {return memo + num;}, 0);
	// var neighborCount = 0;
	// // right neighbor
	// if (board[mod(x + 1, getWidth(board))][y] > 0) {
	// 	neighborCount += 1;
	// }
	// // right bottom
	// if (board[mod(x + 1, getWidth(board))][mod(y - 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// // bottom
	// if (board[x][mod(y - 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// // left bottom
	// if (board[mod(x - 1, getWidth(board))][mod(y - 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// // left
	// if (board[mod(x - 1, getWidth(board))][y] > 0) {
	// 	neighborCount += 1;
	// }
	// // left top
	// if (board[mod(x - 1, getWidth(board))][mod(y + 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// // top
	// if (board[x][mod(y + 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// // right top
	// if (board[mod(x + 1, getWidth(board))][mod(y + 1, getHeight(board))] > 0) {
	// 	neighborCount += 1;
	// }
	// return neighborCount;
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

function getHeight(board) {
	return board[0].length;
}

function getWidth(board) {
	return board.length;
}
