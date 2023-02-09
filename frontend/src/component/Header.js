import { filter, fromEvent, tap } from "rxjs";
import { Component, createElement } from "../Component";
import { routeChange } from "../router";

export default class Header extends Component {
  template() {
    return createElement("header", { class: "header" }, [
      createElement(
        "a",
        null,
        createElement("span", { class: "link-home link-button " }, "RX 산성비")
      ),
      createElement(
        "a",
        null,
        createElement("span", { class: "link-ranking link-button" }, "랭킹보기")
      ),
    ]);
  }

  onMount() {
    const clickHeader$ = fromEvent(document.querySelector(".header"), "click");

    const homeRouteSubscription = clickHeader$
      .pipe(
        filter((x) => x.target.classList.contains("link-home")),
        tap((e) => e.preventDefault())
      )
      .subscribe(() => routeChange("/"));

    const rankingRouteSubscription = clickHeader$
      .pipe(
        filter((x) => x.target.classList.contains("link-ranking")),
        tap((e) => e.preventDefault())
      )
      .subscribe(() => routeChange("/ranking"));

    return () => {
      homeRouteSubscription.unsubscribe();
      rankingRouteSubscription.unsubscribe();
    };
  }
}
