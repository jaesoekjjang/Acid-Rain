import { fromEvent, tap } from "rxjs";
import { Component, createElement, Element, MemoComponent } from "../Component";
import("../keyboardControl");

export class GamePanel extends MemoComponent {
  template() {
    console.log("panel");
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
    console.log(document.querySelector(".game-form"));
    fromEvent(document.querySelector(".game-form"), "submit")
      .pipe(tap((e) => e.preventDefault()))
      .subscribe(console.log);
  }
}
