import Header from "../component/Header";
import { Component, createElement } from "../Component.js";
import { loadText } from "../utils";
import Game from "../Game";
import { filter, fromEvent } from "rxjs";
import { routeChange } from "../router";

const wordList = (await loadText(import.meta.env.VITE_WORDS_PATH)).split(/\s+/);

export default class HomePage extends Component {
  template() {
    return createElement("div", { class: "home-page" }, [
      createElement(Header),
      createElement("div", { class: "content" }, [
        createElement("div", { class: "center" }, [
          createElement("h1", { class: "title" }, "Rx 산성비"),
          createElement(
            "a",
            null,
            createElement(
              "button",
              { class: "link-game btn btn-blue" },
              "게임시작"
            )
          ),
        ]),
      ]),
    ]);
  }

  onMount() {
    fromEvent(document.querySelector(".center"), "click")
      .pipe(
        filter((e) => {
          const {
            target: { classList },
          } = e;
          return classList.contains("link-game") || classList.contains("title");
        })
      )
      .subscribe(() => routeChange("/game"));
  }
}
