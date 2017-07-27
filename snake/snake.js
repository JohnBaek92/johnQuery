const Coord = require("./coord.js");

class Snake {
  constructor(board) {
    this.board = board;
    this.isTurning = false;
    this.direction = "E";
    this.segments = [new Coord(3, 3)];
    this.eatApple = this.eatApple.bind(this);
    this.growthLeft = 0;
  }

  head() {
    return this.segments.slice(-1)[0];
  }

  isValid() {
    const head = this.head();

    if (!this.board.isValidPosition(this.head())) {
      return false;
    }

    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }
    return true;
  }

  move() {
    this.segments.push(this.head().plus(Snake.MOVES[this.direction]));

    this.isTurning = false;

    if (this.eatApple()) {
      this.board.score += 10;
      this.growthLeft = 3;
      this.board.apple.placeApple();
    }

    if (this.growthLeft > 0) {
      this.growthLeft -= 1;
    } else {
      this.segments.shift();
    }
    if (!this.isValid()) {
      this.segments = [];
    }
  }

  turn(direction) {
    if (Snake.MOVES[this.direction].isOpposite(Snake.MOVES[direction]) ||
      this.isTurning) {
      return;
    } else {
      this.isTurning = true;
      this.direction = direction;
    }
  }

  hasCoord(coords) {
    let result = false;
    this.segments.forEach( segment => {
     if ((segment.x === coords[0]) && (segment.y === coords[1])) {
       result = true;
     }
   });
   return result;
 }

  eatApple() {
    if (this.head().equals(this.board.apple.position)) {
      return true;
    } else {
      return false;
    }
  }

}

Snake.MOVES = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};


module.exports = Snake;
