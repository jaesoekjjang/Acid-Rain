import "./style.css";
import { Game } from "./Game";
import { Modal } from "../Modal";
import("./keyboardControl");

document.querySelector("#app").innerHTML = `
<div>
  <div class='game__panel'>
    <div>
      <span class="life">❤️</span>
    </div>
    <ul class='words-list'></ul>
    <form class='game-form'>
      <fieldset class='game-fieldset'>
        <input class="input" type="text" />
        <button class='submit' type="submit">
          <img class='enter' src='/enter-key.svg'/>
        </button>
      </fieldset>
    </form>
  </div>
  <div class='game-over__panel play'>
    <div class='game-over__text'>
      <span>Game Over</span>
    </div>
    <div>
      <button class='game-over__button'>
      <span class='restart'>Play Again</span>
      </button>
    </div>
  </div>
  <div class='modal'></div>
</div>
`;
new Modal(document.querySelector(".modal"));
const WORDS_PATH = "/words_list.txt";

const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};
const words = (await loadText(WORDS_PATH)).split(/\s+/);

const $canvas = document.querySelector("#canvas");
const $form = document.querySelector(".game-form");
const $life = document.querySelector(".life");

const game = new Game({ $canvas, $form, $life });
game.init(words);
game.start(3);

const $restart = document.querySelector(".restart");
$restart.addEventListener("click", () => game.restart(3));
