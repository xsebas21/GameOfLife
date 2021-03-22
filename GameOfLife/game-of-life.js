///// Begin of Configs
var INITIAL_ALIVE_CELLS = [
    // Pantomino    
    [18, 33], [18, 34],
    [19, 32], [19, 33],
    [20, 33],

    // Tetris T-like 
    [7, 29],
    [8, 28], [8, 29], [8, 30],

    // Glider 1
    [15, 15], [15, 16], [15, 17],
    [16, 15],
    [17, 16],

    // Glider 2
    [5, 41],
    [6, 39], [6, 41],
    [7, 40], [7, 41],

    // blinker
    [4, 16],
    [5, 16],
    [6, 16]
];
///// End of Configs

////  Begin of Private variables 
const ID_SEPARATOR = "-";
const ALIVE_CLASS = "alive";
const GRID_ID = "grid";
////  End of of Private variables 

var gameOfLife = function (divContainerId, options) {
    var _intervalId = null;
    var _generation = 0;
    var _maxPopulation = 0;

    /**
     * Sets the default configuration options
     * */
    var setDefaultOptions_autocCalled = function () {
        // Default values
        if (options == null) {
            options = {};
        }

        options.interval ??= 500;
        options.rows ??= 50;
        options.columns ??= 80;
        options.initialAlive ??= INITIAL_ALIVE_CELLS;
        options.onIterationEndCallback ??= null;
    }();

    /**
     * Adds grid events
     * */
    var addGridEvents = function (tableElement) {
        var toggleCell = function (e) {
            if (e.target && e.target.nodeName == "TD") {
                e.target.classList.toggle(ALIVE_CLASS);
            }
        };

        tableElement.addEventListener("click", toggleCell);
    };

    var addInitialAliveCells = function (currentCell) {
        var parsedInitialCells = options.initialAlive.map(function (singleCellArray) {
            return singleCellArray[0].toString() + "-" + singleCellArray[1].toString();
        });


        if (parsedInitialCells.indexOf(currentCell.id) > -1) {
            currentCell.classList.add(ALIVE_CLASS);
        }
    }

    var adjustGridStyles = function (container, table) {
        var cellSizePx = 20;
        var minWidth = options.columns * cellSizePx;
        var minHeight = options.rows * cellSizePx;

        container.classList.add("gridContainer");
    }
    /**
     * Creates the grid
     * */
    var createGrid_autoCalled = function (container, table) {
        var container = document.getElementById(divContainerId);

        var table = document.createElement("table");
        table.classList.add("grid");

        for (var i = 0; i < options.rows; i++) {
            var row = table.insertRow();
            row.className = "gridRow";

            for (var j = 0; j < options.columns; j++) {
                var cell = row.insertCell();
                cell.id = i + ID_SEPARATOR + j;
                cell.className = "cell";

                addInitialAliveCells(cell);
            }
        }

        adjustGridStyles(container, table);
        addGridEvents(table);
        container.appendChild(table);
    }();

    /**
     * Starts iterating with the specified interval.
     * */
    var startInternal = function () {
        _intervalId = setInterval(iterateInternal, options.interval);
    };

    /**
    * Stops the iterations.
    * */
    var stopInternal = function () {
        clearInterval(_intervalId);
    };

    /**
    * Clears the grid.
    * */
    var clearInternal = function () {
        Array.from(document.querySelectorAll("td.cell")).forEach(function (el) {
            el.classList.remove(ALIVE_CLASS);
        });

        _generation = 0;
        onIterationEnd();
    };

    /**
    * At the end of an iteration, it calls this
    * */
    var onIterationEnd = function () {
        var population = document.querySelectorAll("td.cell." + ALIVE_CLASS).length;
        var deadCellsNumber = document.querySelectorAll("td.cell:not(." + ALIVE_CLASS + ")").length;

        if (population > _maxPopulation) {
            _maxPopulation = population;
        }

        var args = {
            generation: _generation,
            population: population,
            deadCellsNumber: deadCellsNumber,
            maxPopulation: _maxPopulation
        };

        if (options.onIterationEndCallback != null) {
            options.onIterationEndCallback(args);
        }
    };

    /**
    * Executes a single iteration
    * */
    var iterateInternal = function () {
        var cellsToKilll = [];
        var cellsToLive = [];

        for (var r = 0; r < options.rows; r++) {

            for (var c = 0; c < options.columns; c++) {
                var currentCellId = r + ID_SEPARATOR + c;
                var currentCell = document.getElementById(currentCellId);

                if (currentCell != null) {
                    var aliveNeighbours = getAdjacentAliveCellsNumber(currentCellId);

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

        _generation++;
        onIterationEnd();
    };

    /**
     * Get the number of neighbors
     * @param {any} cellId
     */
    var getAdjacentAliveCellsNumber = function (cellId) {
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


    /********************************************
     * Public exposed functions
     * 
     ********************************************/
    return {
        start: startInternal,
        stop: stopInternal,
        clear: clearInternal,
        next: iterateInternal
    };
};
