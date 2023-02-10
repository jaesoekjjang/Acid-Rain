import { take } from "rxjs";
import { ajax } from "rxjs/ajax";
import { Component, createElement } from "../Component.js";
import Header from "../component/Header.js";

export default class RankingPage extends Component {
  template() {
    const ranking = this.getState("ranking");

    return createElement("div", { class: "ranking-page" }, [
      createElement(Header),
      createElement(
        "div",
        { class: "content" },
        createElement(
          "div",
          { class: "rank-table-container" },
          createElement("div", { class: "rank-table" }, [
            createElement("div", { class: "row rank-table-header" }, [
              createElement("div", { class: "col-rank align-center" }, "순위"),
              createElement("div", { class: "col-name " }, "이름"),
              createElement("div", { class: "col-score align-center" }, "점수"),
            ]),
            createElement(
              "ol",
              null,
              ranking?.reduce((acc, { name, score }, index) => {
                acc.push(
                  createElement("li", null, [
                    createElement("div", { class: "row" }, [
                      createElement(
                        "div",
                        { class: "col-rank align-center" },
                        `${index + 1}`
                      ),
                      createElement("div", { class: "col-name" }, `${name}`),
                      createElement(
                        "div",
                        { class: "col-score align-center" },
                        `${score}`
                      ),
                    ]),
                  ])
                );
                return acc;
              }, [])
            ),
          ])
        )
      ),
    ]);
  }

  onMount() {
    const ajaxSubscription = ajax({
      url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
      method: "GET",
    })
      .pipe(take(30))
      .subscribe(({ response }) => this.setState("ranking", response));

    return () => ajaxSubscription.unsubscribe();
  }
}
