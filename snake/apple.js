const Coord = require("./coord");

class Apple {
  constructor(board) {
    this.board = board;
    this.placeApple();
  }

  placeApple() {
    let x = Math.floor(Math.random() * this.board.dimension);
    let y = Math.floor(Math.random() * this.board.dimension);
    while (this.board.snake.hasCoord([x, y])) {
      x = Math.floor(Math.random() * this.board.dimension);
      y = Math.floor(Math.random() * this.board.dimension);
    }
    this.position = new Coord(x, y);
  }
}

module.exports = Apple;
