import { fromEvent, tap } from "rxjs";
import { Component, createElement } from "../Component";
import("../keyboardControl");

export class GamePanel extends Component {
  template() {
    return createElement("div", null, [
      createElement("div", { class: "status" }, [
        createElement("span", { class: "score" }),
        createElement("span", { class: "life" }),
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

  onMount() {
    fromEvent(document.querySelector(".game-form"), "submit")
      .pipe(tap((e) => e.preventDefault()))
      .subscribe();
  }
}
