import { fromEvent, tap } from "rxjs";
import { Component, createElement } from "../Component";
import("../keyboardControl");

export class GamePanel extends Component {
  template() {
    const { score, life, gameScore, gameLife } = this.getStates();

    if (gameScore && gameLife) {
      gameScore.subscribe((score) => this.setState("score", score));
      gameLife.subscribe((life) => this.setState("life", life));
    }
    return createElement("div", { class: "game-panel" }, [
      createElement("div", { class: "status" }, [
        createElement("span", { class: "score" }, score),
        createElement("span", { class: "life" }, life),
      ]),
      createElement("form", { class: "game-form" }, [
        createElement("fieldset", { class: "game-fieldset" }, [
          createElement("input", { class: "input", type: "text" }),
          createElement("button", { class: "submit", type: "submit" }, [
            createElement("img", { class: "enter", src: "/enter-key.svg" }),
          ]),
        ]),
      ]),
    ]);
  }
}
