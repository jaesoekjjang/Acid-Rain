import { fromEvent } from "rxjs";
import { Component, createElement } from "../Component";
import("../keyboardControl");

const hearts = (n) =>
  Array.from({ length: 3 }, (_, i) =>
    i < 3 - n
      ? createElement("li", null, "🖤")
      : createElement("li", null, "❤️")
  );

export class GamePanel extends Component {
  template() {
    const { score = 0, life, game } = this.getStates();

    return createElement("div", { class: "game-panel" }, [
      createElement("div", { class: "status" }, [
        createElement("ul", { class: "life" }, hearts(life)),
        createElement("span", { class: "score" }, score),
        createElement(
          "span",
          { class: "mute" },
          createElement("img", {
            src: `${game?.muted ? "/sound-on.svg" : "/sound-off.svg"}`,
          })
        ),
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
