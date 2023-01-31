import "../style.css";
import { Modal } from "./component/Modal";
import { Component } from "./Component";
import { GamePanel } from "./component/GamePanel";
import { Game } from "./models/Game";
import { loadText } from "./utils";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

new (class App extends Component {
  onMount() {
    const container = document.querySelector(".container");

    const gamePanel = new GamePanel(
      container,
      {
        tag: "div",
      },
      {
        setIsPlaying: (value) => this.setState("isPlaying", value),
      }
    );

    const $canvas = document.querySelector("#canvas");
    const $fieldset = document.querySelector(".game-fieldset");
    const $form = document.querySelector(".game-form");
    const $input = $form.querySelector("input");
    const $life = document.querySelector(".life");
    const game = new Game({ $canvas, $form, $life });

    const modal = new Modal(
      container,
      { tag: "div" },
      {
        game,
        isPlaying: () => this.getState("isPlaying"),
        setIsPlaying: (value) => this.setState("isPlaying", value),
        ranking: [],
      }
    );

    this.addComponents([gamePanel, modal]);

    const onGameStart = () => {
      this.setState("isPlaying", true);
      $fieldset.disabled = false;
      $input.focus();
    };

    const onGameOver = () => {
      this.setState("isPlaying", false);
      $fieldset.disabled = true;
    };
    game.init({ wordList, onGameStart, onGameOver });
    game.setDifficulty(3);
    game.start();
  }
})(
  document.querySelector("#app"),
  { tag: "div", attrs: { class: "container" } },
  { isPlaying: true }
);
