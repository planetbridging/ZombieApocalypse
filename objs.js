var uuid = require("uuid");

class objZombie {
  constructor(x, y, color) {
    this.id = uuid.v4();
    this.x = x;
    this.y = y;
    this.path = [];
    this.untilLegsBreak = 30;
    this.color = color;
  }
}

module.exports = {
  objZombie,
};
