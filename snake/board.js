const Snake = require("./snake.js");
const Coord = require("./coord.js");
const Apple = require("./apple.js");

class Board {
  constructor(highScore) {
    this.snake = new Snake(this);
    this.score = 0;
    if (highScore) {
      this.highScore = highScore;
    } else {
      this.highScore = 0;
    }
    this.dimension = 25;
    this.apple = new Apple(this);
  }

  isValidPosition(coord) {
    return (coord.x >= 0 && coord.x < this.dimension &&
            coord.y >= 0 && coord.y < this.dimension);
  }
}

module.exports = Board;
