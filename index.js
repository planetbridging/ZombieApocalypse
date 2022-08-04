//imports
var PF = require("pathfinding");
var uuid = require("uuid");
//classes n stuff
const { objZombie } = require("./objs");

//lists
var lstDeers = []; //contents = x,y,uuid per item
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
  newZombie(0, 0);
  newDeer(8, 6);
  //test();
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
    walkZombie();
    printInfo();
  }
}

function newZombie(x, y) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  lstZombies.push(new objZombie(x, y, randomColor));
}

function newDeer(x, y) {
  lstDeers.push([x, y, uuid.v4()]);
}

function printInfo() {
  console.log("---");
  console.log("zombies");
  console.log(lstZombies);
  console.log("deers");
  console.log(lstDeers);
}

function walkZombie() {
  var lstDeleteZombiePile = [];
  if (lstZombies.length > 0) {
    for (var z in lstZombies) {
      if (lstZombies[z].untilLegsBreak <= 0) {
        lstDeleteZombiePile.push(lstZombies[z]);
        break;
      }
      if (lstZombies[z].path.length > 0) {
        lstZombies[z].x = lstZombies[z].path[0][0];
        lstZombies[z].y = lstZombies[z].path[0][1];
        lstZombies[z].path.shift();
        lstZombies[z].untilLegsBreak = lstZombies[z].untilLegsBreak - 1;
      }
    }
    for (var p in lstDeleteZombiePile) {
      for (var z in lstZombies) {
        if (lstDeleteZombiePile[p] == lstZombies[z].id) {
          lstZombies.splice(z, 1);
          break;
        }
      }
    }
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
        newZombie(lstDeers[d][0], lstDeers[d][1]);
        lstDeleteDeerPile.push(lstDeers[d][2]);
      }
    }
  }
  for (var p in lstDeleteDeerPile) {
    for (var d in lstDeers) {
      if (lstDeleteDeerPile[p] == lstDeers[d][2]) {
        lstDeers.splice(d, 1);
        break;
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
      if (lstDeers.length > 0) {
        console.log(lstDeers[0]);
        var path = finder.findPath(
          lstZombies[z].x,
          lstZombies[z].y,
          lstDeers[0][0],
          lstDeers[0][1],
          grid
        );
        lstZombies[z].path = path;
      }
    }
  }
}
