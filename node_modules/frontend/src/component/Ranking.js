import { take } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Component, createElement } from "../Component.js";

export class Ranking extends Component {
  template({ ranking }) {
    return createElement("div", { class: "ranking" }, [
      createElement("header", null, "헤더"),
      createElement(
        "ul",
        null,
        ranking?.reduce((acc, { name, score }, index) => {
          acc.push(
            createElement("li", null, [
              createElement("span", null, `${index + 1}위`),
              createElement("span", null, "|"),
              createElement("span", null, `${name}`),
              createElement("span", null, "|"),
              createElement("span", null, `${score}`),
            ]),
            createElement("hr")
          );
          return acc;
        }, [])
      ),
    ]);
  }

  onMount() {
    ajax({
      url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
      method: "GET",
    })
      .pipe(take(30))
      .subscribe(({ response }) => this.setState("ranking", response));
  }
}
