import "../style.css";
import { Modal } from "./component/Modal";
import { Component, createElement } from "./Component";
import { GamePanel } from "./component/GamePanel";
import { loadText } from "./utils";
import { init } from "./router";
import { Ranking } from "./component/Ranking";
import Game from "./Game";
import Header from "./component/Header";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

class App extends Component {
  template() {
    const isPlaying = this.getState("isPlaying");

    const { score, life, game } = this.getStates();

    return createElement("div", null, [
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
    console.log(this.$parent);
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
  }
}

const route = () => {
  const { pathname } = location;
  const $root = document.querySelector("#root");
  $root.innerHTML = "";

  if (pathname === "/") {
    const $app = document.createElement("div");
    $app.setAttribute("id", "app");

    const canvas = document.createElement("CANVAS");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    $root.insertAdjacentElement("afterbegin", canvas);
    $root.insertAdjacentElement("beforeend", $app);

    new App({ isPlaying: true }).mount($app);
  }

  if (pathname === "/ranking") {
    new Ranking().mount($root);
  }
};

init(route);
route();
addEventListener("popstate", route);
