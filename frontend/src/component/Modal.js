import { BehaviorSubject, fromEvent } from "rxjs";
import { filter, map, mergeMap, share, takeUntil, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Component, createElement } from "../Component.js";
import { routeChange } from "../router.js";

export class Modal extends Component {
  template() {
    const score = this.getState("score");

    return createElement("div", { class: "modal-background" }, [
      createElement("div", { class: "modal" }, [
        createElement("form", { class: "modal-form" }, [
          createElement("div", null, [
            createElement("input", {
              class: "name-input",
              type: "text",
              name: "name",
              type: "text",
              placeholder: "이름",
            }),
            createElement("input", {
              class: "score-input",
              type: "text",
              name: "score",
              value: `${score} 점`,
              disabled: true,
            }),
          ]),
          createElement(
            "div",
            null,
            createElement(
              "button",
              { class: "register btn btn-yellow" },
              "랭킹 등록하기"
            )
          ),
        ]),
        createElement("div", null, [
          createElement(
            "button",
            { class: "restart btn btn-blue" },
            "다시하기"
          ),
          createElement(
            "button",
            { class: "link-ranking btn btn-blue" },
            "랭킹보러 가기"
          ),
        ]),
      ]),
    ]);
  }

  onMount() {
    const { setIsPlaying, game } = this.getStates();
    const clickModal$ = fromEvent(document.querySelector(".modal"), "click");

    const registerSubscription = clickModal$
      .pipe(
        filter((x) => x.target.classList.contains("register")),
        tap((e) => e.preventDefault()),
        map(() => {
          const { name, score } = document.querySelector(".modal-form");
          return { userName: name.value, score: score.value.replace("점", "") };
        }),
        mergeMap((body) =>
          ajax({
            url: `${import.meta.env.VITE_BASE_URL}/game`,
            method: "POST",
            body,
          })
        )
      )
      .subscribe(({ response }) => console.log(response));

    const restartSubscription = clickModal$
      .pipe(filter((x) => x.target.classList.contains("restart")))
      .subscribe(() => {
        setIsPlaying(true);
        game.start();
      });

    const routeSubscription = clickModal$
      .pipe(
        filter((x) => x.target.classList.contains("link-ranking")),
        tap((e) => e.preventDefault())
      )
      .subscribe(() => {
        game.destroy();
        routeChange("/ranking");
      });

    return () => {
      registerSubscription.unsubscribe();
      restartSubscription.unsubscribe();
      routeSubscription.unsubscribe();
    };
  }
}

// TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
