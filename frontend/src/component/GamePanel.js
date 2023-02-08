import { fromEvent, tap } from "rxjs";
import { Component, createElement } from "../Component";
import("../keyboardControl");

export class GamePanel extends Component {
  template() {
    const { score = 0, life } = this.getStates();
    const hearts = (n) => "🖤".repeat(3 - n) + "❤️".repeat(n);

    return createElement("div", { class: "game-panel" }, [
      createElement("div", { class: "status" }, [
        createElement("span", { class: "score" }, score),
        createElement("span", { class: "life" }, hearts(life)),
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
