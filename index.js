//imports
var PF = require("pathfinding");
var uuid = require("uuid");
const http = require("http");
var express = require("express"),
  app = express(),
  server = require("http").createServer(app);
//classes n stuff
const { objZombie } = require("./objs");
const { encrypt, decrypt } = require("./crypto");
//lists n more
var lstDeers = []; //contents = x,y,uuid per item
var lstZombies = [];
var lstFreeSpaces = [];
var publicSecretKey = "whyDontZomiesLegsBreakInMovies";
var matrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
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

//start the server
(async () => {
  console.log("welcome to the zombie war backend");
  //newZombie(0, 0);
  //newDeer(8, 6);
  findFreeXY();
  //test();
  //game ticks every second
  setInterval(gameTick, 1000);
})();

function test() {
  var finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });
  //path finding stuff
  var grid = new PF.Grid(matrix);
  var path = finder.findPath(0, 0, 10, 6, grid);
  console.log(path[0]);
  console.log(path);
}

function findFreeXY() {
  for (var y in matrix) {
    for (var x in matrix[y]) {
      if (matrix[y][x] == 0) {
        lstFreeSpaces.push([x, y]);
      }
    }
  }
}

function gameTick() {
  generateDeerOrZombies();
  if (lstZombies.length > 0 && lstDeers.length > 0) {
    turnDeerToZombie();
    walkZombie();
    printInfo();
  }
}

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateDeerOrZombies() {
  if (lstZombies.length == 0) {
    var findClearing = getRandom(lstFreeSpaces);
    newZombie(findClearing[0], findClearing[1]);
  }

  if (lstDeers.length == 0) {
    for (var i = 0; i <= 5; i++) {
      var findClearing = getRandom(lstFreeSpaces);
      newDeer(findClearing[0], findClearing[1]);
    }
  }
}

function newZombie(x, y) {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  lstZombies.push(new objZombie(x, y, randomColor));
}

function newDeer(x, y) {
  lstDeers.push([Number(x), Number(y), uuid.v4()]);
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
  for (var z in lstZombies) {
    if (lstZombies[z].untilLegsBreak <= 0) {
      lstDeleteZombiePile.push(lstZombies[z].id);
    }
    //check if has path
    if (lstZombies[z].path.length > 0) {
      lstZombies[z].x = lstZombies[z].path[0][0];
      lstZombies[z].y = lstZombies[z].path[0][1];
      lstZombies[z].path.shift();
      lstZombies[z].untilLegsBreak = lstZombies[z].untilLegsBreak - 1;
    } else {
      if (lstDeers.length > 0) {
        console.log("generate path");
        var findRandomDeer = getRandom(lstDeers);
        var grid = new PF.Grid(matrix);
        var finder = new PF.AStarFinder({
          allowDiagonal: false,
          dontCrossCorners: false,
        });
        var path = finder.findPath(
          lstZombies[z].x,
          lstZombies[z].y,
          findRandomDeer[0],
          findRandomDeer[1],
          grid
        );
        lstZombies[z].path = path;
        console.log(path, findRandomDeer);
        console.log(lstZombies[z]);
      }
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

//---------------------------socketio

function multiIoPass(io) {
  io.on("connection", async function (socket) {
    var jSendMatrix = JSON.stringify({
      lstData: matrix,
    });
    socket.emit("sendMatrix", jSendMatrix);

    socket.on("getZombies", async (data) => {
      try {
        var de = decrypt(publicSecretKey, data);
        try {
          var jSend = JSON.stringify({
            lstData: lstZombies,
          });
          var enData = encrypt(publicSecretKey, jSend);

          socket.emit("getZombies", enData);
        } catch {
          console.log("failed to process data: getZombies");
          console.log(de);
          console.log(publicSecretKey, "---" + data + "---");
        }
      } catch (exTbl) {
        console.log("failed to decrypt data: getZombies");
        console.log(exTbl);
      }
    });

    socket.on("getDeers", async (data) => {
      try {
        var de = decrypt(publicSecretKey, data);
        try {
          var jSend = JSON.stringify({
            lstData: lstDeers,
          });
          var enData = encrypt(publicSecretKey, jSend);

          socket.emit("getDeers", enData);
        } catch {
          console.log("failed to process data: getDeers");
          console.log(de);
          console.log(publicSecretKey, "---" + data + "---");
        }
      } catch (exTbl) {
        console.log("failed to decrypt data: getDeers");
        console.log(exTbl);
      }
    });
  });

  return io;
}

//-------express hosting

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
  next();
});
app.use("/", express.static(__dirname + "/cloud/"));

var server_http = http.createServer(app);
server_http.listen(9444, function () {
  console.log("server running at 9444");
});

const ioImport = require("socket.io")(server_http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

multiIoPass(ioImport);
