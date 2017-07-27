class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(coord2) {
    return (this.x == coord2.x) && (this.y == coord2.y);
  }

  isOpposite(coord2) {
    return (this.x == (-1 * coord2.x)) && (this.y == (-1 * coord2.y));
  }

  plus(coord2) {
    return new Coord(this.x + coord2.x, this.y + coord2.y);
  }
}

module.exports = Coord;
