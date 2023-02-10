import { Modal } from "../component/Modal";
import { Component, createElement } from "../Component";
import { GamePanel } from "../component/GamePanel";
import { loadText } from "../utils";
import Game from "../Game";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

export default class GamePage extends Component {
  template() {
    const isPlaying = this.getState("isPlaying");

    const { score, life, game } = this.getStates();

    return createElement("div", { class: "game-page" }, [
      createElement("canvas", {
        id: "canvas",
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }),
      createElement(GamePanel, {
        score,
        life,
      }),
      isPlaying
        ? null
        : createElement(Modal, {
            game,
            score,
            setIsPlaying: (val) => this.setState("isPlaying", val),
          }),
    ]);
  }

  onMount() {
    // import("../keyboardControl.js");
    const $canvas = document.querySelector("canvas");
    const $fieldset = document.querySelector(".game-fieldset");
    const $form = document.querySelector(".game-form");
    const $input = $form.querySelector(".input");

    const onGameStart = () => {
      this.setState("isPlaying", true);
      $fieldset.disabled = false;
      $input.focus();
    };
    const onGameOver = () => {
      this.setState("isPlaying", false);
      $fieldset.disabled = true;
    };

    const game = Game.getInstance(wordList, $canvas, $form);
    game.onGameStart = onGameStart;
    game.onGameOver = onGameOver;
    this.setState("game", game);

    game.start();

    game.getLifeStream().subscribe((life) => {
      this.setState("life", life);
    });
    game.getScoreStream().subscribe((score) => this.setState("score", score));

    return () => game.destroy();
  }
}
