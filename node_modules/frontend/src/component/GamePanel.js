import { Component } from "../Component";
import { Game } from "../models/Game";

const WORDS_PATH = "/words_list.txt";

const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};
const words = (await loadText(WORDS_PATH)).split(/\s+/);

export class GamePanel extends Component {
  template(state) {
    return `
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
    `;
  }

  onMount() {
    const $canvas = document.querySelector("#canvas");
    const $form = document.querySelector(".game-form");
    const $life = document.querySelector(".life");

    const game = new Game({ $canvas, $form, $life });
    game.init(words);
    game.start(3);
  }
}
