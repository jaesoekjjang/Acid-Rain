import "../style.css";
import { Modal } from "./component/Modal";
import { Component } from "./Component";
import { GamePanel } from "./component/GamePanel";
import { Game } from "./models/Game";
import { loadText } from "./utils";
import { init } from "./router";
import { Ranking } from "./component/Ranking";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

class App extends Component {
  onMount() {
    const container = document.querySelector(".container");

    const gamePanel = new GamePanel(
      container,
      {
        tag: "div",
        attrs: { class: "game_panel" },
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
        score: () => this.getState("score"),
      }
    );

    this.addComponents([gamePanel, modal]);

    const onGameStart = () => {
      //! 여기서 시작하자마자 한번 리렌더링 됨
      this.setState("isPlaying", true);
      $fieldset.disabled = false;
      $input.focus();
    };

    const onGameOver = () => {
      this.setState("isPlaying", false);
      this.setState("score", game.getScore());
      $fieldset.disabled = true;
    };

    game.init({ wordList, onGameStart, onGameOver });

    //TODO 난이도 설정 UI
    game.setDifficulty(4);
    game.start();
  }
}

const route = () => {
  const { pathname } = location;
  document.querySelector("#app").innerHTML = "";

  if (pathname === "/") {
    const canvas = document.createElement("CANVAS");
    canvas.setAttribute("id", "canvas");
    document.querySelector("#app").appendChild(canvas);
    new App(
      document.querySelector("#app"),
      { tag: "div", attrs: { class: "container" } },
      { isPlaying: true, score: 0 }
    );
  }

  if (pathname === "/ranking") {
    new Ranking(document.querySelector("#app"), {
      tag: "div",
      attrs: { class: "ranking" },
    });
  }
};

init(route);
route();
addEventListener("popstate", route);
