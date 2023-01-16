import "./style.css";
import { init } from "./counter.js";

document.querySelector("#app").innerHTML = `
<div>
  <div class='game__panel'>
    <div>
      <span class="life">123</span>
    </div>
    <ul class='words-list'></ul>
    <input class="input" type="text" />
  </div>
  <div class='game-over__panel play'>
    <div class='game-over__text'>
      <span>Game Over</span>
    </div>
    <div>
      <button class='game-over__button'>
      <span>Play Again</span>
      </button>
    </div>
  </div>
</div>
`;

init();
