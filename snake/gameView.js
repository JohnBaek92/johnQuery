const Board = require("./board.js");
const $j = require("../johnQuery/lib/main.js");

class gameView{
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.board = new Board();
    this.grid = this.buildGrid();
    this.scoreEl = $j('.score');
    this.highScoreEl = $j('.high-score');
    this.gameOverEl = $j('.game-over');
    this.restart = this.restart.bind(this);
    $j(window).on("keydown", this.handleKeyEvent.bind(this));
  }

  buildGrid() {
    let rootInnerHTML = "";
    for (let i = 0; i < this.board.dimension; i++) {
      rootInnerHTML += "<ul>";
      for (let j = 0; j < this.board.dimension; j++) {
        rootInnerHTML += "<li></li>";
      }
      rootInnerHTML += "</ul>";
    }
    this.rootEl.html(rootInnerHTML);
    this.liList = $j("li");
  }

  handleKeyEvent(e) {
    if (gameView.KEYS[e.keyCode]) {
      this.board.snake.turn(gameView.KEYS[e.keyCode]);
    }
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
    this.updateSnakeHead();
    this.updateScore();
  }

  updateClasses(coords, className) {
    $j(`.${className}`).removeClass(className);
    if (coords) {
      coords.forEach( coord => {
        const flatCoord = (coord.x * this.board.dimension) + coord.y;
        if (this.liList) {
          this.liList.eq(flatCoord).addClass(className);
        }
      });
    }
  }

  updateSnakeHead() {
    $j(`.snake-head`).removeClass('snake-head');
    let coord = this.board.snake.segments[this.board.snake.segments.length-1];
    if (coord) {
      let flatCoord = coord.x * this.board.dimension + coord.y;
      this.liList.eq(flatCoord).addClass('snake-head');
    }
  }

  updateScore() {
    this.scoreEl.html(`Score: ${this.board.score}`);
    this.highScoreEl.html(`High Score: ${this.board.highScore}`);
  }

  updateHighScore () {
    let score = this.board.score;
    let highScore = this.board.highScore;
    if (score > highScore) {
      highScore = score;
      score = 0;
    }
    this.scoreEl.html(`Score: ${score}`);
    this.highScoreEl.html(`High Score: ${highScore}`);
  }

  step() {
    if (this.board.snake.segments.length > 0 ) {
      this.board.snake.move();
      this.render();
    } else {
      this.updateHighScore();
      this.renderGameOver();
    }
  }

  renderGameOver() {
    this.gameOverEl.removeClass('hidden');
    this.gameOverEl.on('click', () => {
      this.gameOverEl.addClass('hidden');
      this.board = new Board(Math.max(this.board.score, this.board.highScore));
      window.clearInterval(this.gameInterval);
      this.gameInterval = window.setInterval( this.step.bind(this), 100);
    });
  }

  restart() {
    this.gameInterval = window.setInterval( this.step.bind(this), 100);
  }
}

gameView.KEYS = {
  37: "W",
  38: "N",
  39: "E",
  40: "S",
};

module.exports = gameView;
