import { filter, fromEvent, tap } from "rxjs";
import { Component, createElement } from "../Component";
import { routeChange } from "../router";

export default class Header extends Component {
  template() {
    return createElement("header", { class: "header" }, [
      createElement(
        "div",
        null,
        createElement("a", { class: "link-home" }, "메인으로")
      ),
      createElement(
        "div",
        null,
        createElement("a", { class: "link-ranking" }, "랭킹보기")
      ),
    ]);
  }

  onMount() {
    const clickHeader$ = fromEvent(document.querySelector(".header"), "click");

    const homeRouteSubscription = clickHeader$
      .pipe(
        filter((x) => x.target.classList.contains("link-home")),
        tap((e) => {
          e.preventDefault();
          routeChange("/");
        })
      )
      .subscribe();

    return () => homeRouteSubscription.unsubscribe();
  }
}
