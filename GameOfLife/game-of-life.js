///// Begin of Configs
var rows = 50;
var columns = 80;
var initialAliveCells = [
    "5-5", "5-6",
    "6-5", "6-6"
];

///// End of Configs

var game = {};

game.draw = function () {
    var grid = document.getElementById("grid");

    for (var i = 0; i < rows; i++) {
        var row = grid.insertRow();
        row.className = "gridRow";

        for (var j = 0; j < columns; j++) {
            var cell = row.insertCell();
            cell.id = i + "-" + j;
            cell.className = "cell";

            if (initialAliveCells.indexOf(cell.id) > -1) {
                cell.classList.add("alive");
            }
        }
    }
};