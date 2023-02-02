import "../style.css";
import { Modal } from "./component/Modal";
import { Component, createElement, Element } from "./Component";
import { GamePanel } from "./component/GamePanel";
import { Game } from "./models/Game";
import { loadText } from "./utils";
import { init } from "./router";
import { Ranking } from "./component/Ranking";
import { fromEvent } from "rxjs";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

// class Moddal extends Component {
//   template({ isPlaying }) {
//     return isPlaying ? new Element("div", { class: "modal" }, ["modal"]) : null;
//   }

//   onMount() {
//     return () => {
//       console.log("unmount");
//     };
//   }
// }

// class App extends Component {
//   template(state) {
//     return new Element("div", null, [
//       new Element("button", { class: "start" }, ["start"]),
//       new Element("button", { class: "stop" }, ["stop"]),
//       new Element("span", null, [new Moddal(state)]),
//     ]);
//   }

//   onMount() {
//     const setIsPlaying = (v) => this.setState("isPlaying", v);
//     fromEvent(document.querySelector(".start"), "click").subscribe(() => {
//       console.log("click");
//       setIsPlaying(true);
//     });
//     fromEvent(document.querySelector(".stop"), "click").subscribe(() =>
//       setIsPlaying(false)
//     );
//   }
// }

// new App({ isPlaying: true }).render(document.querySelector("#app"));

class App extends Component {
  template(state) {
    return createElement("div", null, [
      createElement(GamePanel, {
        ...state,
      }),
      state.isPlaying
        ? null
        : createElement(Modal, {
            ...state,
            setIsPlaying: (val) => this.setState("isPlaying", val),
          }),
    ]);
  }

  onMount() {
    const $canvas = document.querySelector("#canvas");
    const $fieldset = document.querySelector(".game-fieldset");
    const game = new Game({ $canvas });

    this.setState("game", game);

    const onGameStart = () => {
      //! 여기서 시작하자마자 한번 리렌더링 됨
      $fieldset.disabled = false;
      document.querySelector(".input").focus();
    };
    const onGameOver = () => {
      this.setState("isPlaying", false);
      this.setState("score", game.getScore());
      $fieldset.disabled = true;
    };
    game.init({ wordList, onGameOver, onGameStart });
    game.setDifficulty(4);
    game.start();
  }
}

const route = () => {
  const { pathname } = location;

  if (pathname === "/") {
    const canvas = document.createElement("CANVAS");
    canvas.setAttribute("id", "canvas");
    document.body.insertBefore(canvas, document.body.firstChild);
    new App({ isPlaying: true }).mount(document.querySelector("#app"));
  }

  if (pathname === "/ranking") {
    new Ranking().mount(document.querySelector("#app"));
  }
};

init(route);
route();
addEventListener("popstate", route);
