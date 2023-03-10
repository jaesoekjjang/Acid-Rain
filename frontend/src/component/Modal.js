import { BehaviorSubject, fromEvent } from "rxjs";
import {
  debounce,
  filter,
  map,
  mergeMap,
  share,
  takeUntil,
  tap,
  throttleTime,
} from "rxjs/operators";
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
            createElement("div", { class: "input-row" }, [
              createElement("input", {
                class: "name-input",
                type: "text",
                name: "name",
                type: "text",
                placeholder: "이름(둘 이상의 문자와 숫자의 조합)",
              }),
              // createElement(
              //   "span",
              //   { class: "error" },
              //   "2~15자의 문자 또는 문자와 숫자의 조합만 사용 가능합니다."
              // ),
            ]),
            createElement(
              "div",
              { class: "input-row" },
              createElement("input", {
                class: "score-input",
                type: "text",
                name: "score",
                value: `${score} 점`,
                disabled: true,
              })
            ),
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
        filter((e) => e.target.classList.contains("register")),
        tap((e) => e.preventDefault()),
        throttleTime(1000),
        map(() => {
          const { name, score } = document.querySelector(".modal-form");
          return {
            userName: name.value,
            score: score.value.replace(" 점", ""),
          };
        }),
        mergeMap((body) =>
          ajax({
            url: `${import.meta.env.VITE_BASE_URL}/game`,
            method: "POST",
            body,
          })
        )
      )
      .subscribe({
        next: () => {
          routeChange("/ranking");
        },
        error: (error) => {
          console.log(error);
        },
      });

    const restartSubscription = clickModal$
      .pipe(filter((e) => e.target.classList.contains("restart")))
      .subscribe(() => {
        setIsPlaying(true);
        game.start();
      });

    const routeSubscription = clickModal$
      .pipe(
        filter((e) => e.target.classList.contains("link-ranking")),
        tap((e) => e.preventDefault())
      )
      .subscribe(() => routeChange("/ranking"));

    return () => {
      registerSubscription.unsubscribe();
      restartSubscription.unsubscribe();
      routeSubscription.unsubscribe();
    };
  }
}

// TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
