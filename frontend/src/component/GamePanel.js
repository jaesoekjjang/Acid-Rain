import { Component } from "../Component";
import { Game } from "../models/Game";
import { loadText } from "../utils";

const text = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

export class GamePanel extends Component {
  template() {
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
    game.init(text);
    game.start(3);
  }
}
