var PF = require("pathfinding");

(async () => {
  console.log("welcome to the zombie war backend");

  var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
  ];
  var grid = new PF.Grid(matrix);
  var finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  var path = finder.findPath(0, 0, 1, 2, grid);
  console.log(path);
})();
