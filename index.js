//imports
var PF = require("pathfinding");
var uuid = require("uuid");
//classes n stuff
const { objZombie } = require("./objs");

//lists
var lstDeers = [];
var lstZombies = [];

var matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//path finding stuff
var grid = new PF.Grid(matrix);

//tick session update checking
var session = uuid.v4();

//start the server
(async () => {
  console.log("welcome to the zombie war backend");
  //front and backend with the same grid
  test();
  //game ticks every second
  setInterval(gameTick, 1000);
})();

function test() {
  var finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  var path = finder.findPath(0, 0, 10, 6, grid);
  console.log(path[0]);
  console.log(path);
}

function gameTick() {
  if (lstZombies.length > 0 && lstDeers.length > 0) {
    turnDeerToZombie();
    generatePathsForZombies();
  }
}

function turnDeerToZombie() {
  var lstDeleteDeerPile = [];
  for (var z in lstZombies) {
    for (var d in lstDeers) {
      if (
        lstZombies[z].x == lstDeers[d][0] &&
        lstZombies[z].y == lstDeers[d][1]
      ) {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        lstZombies.push(
          new objZombie(lstDeers[d][0], lstDeers[d][1], randomColor)
        );
        lstDeleteDeerPile.push(lstDeers[d][2]);
      }
    }
  }
}

function generatePathsForZombies() {
  for (var z in lstZombies) {
    if (lstZombies[z].path.length == 0) {
      var finder = new PF.AStarFinder({
        allowDiagonal: false,
        dontCrossCorners: true,
      });

      var path = finder.findPath(
        lstZombies[z].x,
        lstZombies[z].y,
        lstDeers[0].x,
        lstDeers[0].y,
        grid
      );
      lstZombies[z].path = path;
    }
  }
}
