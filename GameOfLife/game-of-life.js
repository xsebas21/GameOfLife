///// Begin of Configs
var rows = 50;
var columns = 80;
var initialAliveCells = [
    "5-5", "5-6",
    "6-5", "6-6",

    "7-29",
    "8-28", "8-29", "8-30",

    // Glider
    "15-15", "15-16", "15-17",
    "16-15",
    "17-16",

    // Glider 2
    "5-41",
    "6-39", "6-41",
    "7-40", "7-41",

    // blinker
    "4-16",
    "5-16",
    "6-16"
];
///// End of Configs

////  Begin of Private variables 
const ID_SEPARATOR = "-";
const ALIVE_CLASS = "alive";
const GRID_ID = "grid";
////  End of of Private variables 

var game = {};

game.draw = function () {
    var grid = document.getElementById(GRID_ID);

    for (var i = 0; i < rows; i++) {
        var row = grid.insertRow();
        row.className = "gridRow";

        for (var j = 0; j < columns; j++) {
            var cell = row.insertCell();
            cell.id = i + ID_SEPARATOR + j;
            cell.className = "cell";

            if (initialAliveCells.indexOf(cell.id) > -1) {
                cell.classList.add(ALIVE_CLASS);
            }
        }
    }
};

game.iterate = function () {
    var cellsToKilll = [];
    var cellsToLive = [];

    for (var r = 0; r < rows; r++) {

        for (var c = 0; c < columns; c++) {
            var currentCellId = r + ID_SEPARATOR + c;
            var currentCell = document.getElementById(currentCellId);

            if (currentCell != null) {
                var aliveNeighbours = game.getAdjacentAliveCellsNumber(currentCellId);

                // Check and Set the state of the cell
                if (aliveNeighbours < 2 && currentCell.classList.contains(ALIVE_CLASS)) {
                    // Mark the cell to die
                    cellsToKilll.push(currentCell);

                } else if (aliveNeighbours == 2) {
                    // Nothing changes

                } else if (aliveNeighbours == 3 && !currentCell.classList.contains(ALIVE_CLASS)) {
                    // The cell becomes a live cell
                    cellsToLive.push(currentCell);

                } else if (aliveNeighbours >= 4 && currentCell.classList.contains(ALIVE_CLASS)) {
                    // The cell dies by overpopulation
                    cellsToKilll.push(currentCell);
                }
            }
        }
    }

    // Set marked cells as dead
    for (var i = 0; i < cellsToKilll.length; i++) {
        cellsToKilll[i].classList.remove(ALIVE_CLASS);
    }

    // Set marked cells as alive
    for (var i = 0; i < cellsToLive.length; i++) {
        cellsToLive[i].classList.add(ALIVE_CLASS);
    }
};

game.getAdjacentAliveCellsNumber = function (cellId) {
    var indexes = cellId.split(ID_SEPARATOR);
    var row = parseInt(indexes[0]);
    var column = parseInt(indexes[1]);
    var counter = 0;

    for (var r = -1; r <= 1; r++) {
        var rowToEvaluate = row + r;

        for (var c = -1; c <= 1; c++) {
            var columnToEvaluate = column + c;
            var currentCellId = rowToEvaluate + ID_SEPARATOR + columnToEvaluate;

            if (currentCellId != cellId) {
                var currentCell = document.getElementById(currentCellId);

                if (currentCell != null && currentCell.classList.contains(ALIVE_CLASS)) {
                    counter++;
                }
            }
        }
    }

    return counter;
};
