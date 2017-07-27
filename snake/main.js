const $j = require("../johnQuery/lib/main.js");
const gameView = require("./gameView.js");

document.addEventListener('DOMContentLoaded', () => {
  $j('.new-game').removeClass('hidden');
  const rootEl = $j('.grid');
  const view = new gameView(rootEl);
  $j('.new-game').on('click', () => {
    view.gameInterval = setInterval( view.step.bind(view), 100);

    $j('.new-game').addClass('hidden');
  });
});
