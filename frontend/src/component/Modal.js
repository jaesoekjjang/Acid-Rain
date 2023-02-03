import { fromEvent } from "rxjs";
import { filter, map, mergeMap, share, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Component, createElement } from "../Component.js";
import { routeChange } from "../router.js";

export class Modal extends Component {
  template() {
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
              value: `점`,
              disabled: true,
            }),
          ]),
          createElement(
            "div",
            null,
            createElement("button", { class: "register" }, "랭킹 등록하기")
          ),
        ]),
        createElement("div", null, [
          createElement("button", { class: "restart" }, "다시하기"),
          createElement("button", { class: "ranking" }, "랭킹보기"),
        ]),
      ]),
    ]);
  }

  //! 첫 렌더시에만 실행돼야함
  // onMount() {
  //   const { setIsPlaying, isPlaying } = this.getStates();
  //   const clickModal = fromEvent(
  //     document.querySelector(".modal"),
  //     "click"
  //   ).pipe(share());

  //   clickModal
  //     .pipe(filter((x) => x.target.classList.contains("restart")))
  //     .subscribe(() => setIsPlaying(false));
  // }

  onRender() {
    const clickModal = fromEvent(
      document.querySelector(".modal"),
      "click"
    ).pipe(share());

    const { setIsPlaying, game } = this.getStates();
    clickModal.subscribe(() => {
      setIsPlaying(true);
      game.restart();
    });

    // const onClickRegister = clickModal
    //   .pipe(
    //     filter((x) => x.target.classList.contains("register")),
    //     tap((e) => e.preventDefault()),
    //     map(() => {
    //       const { name, score } = document.querySelector(".modal-form");
    //       return { userName: name.value, score: score.value.replace("점", "") };
    //     }),
    //     mergeMap((body) =>
    //       ajax({
    //         url: `${import.meta.env.VITE_BASE_URL}/game`,
    //         method: "POST",
    //         body,
    //       })
    //     )
    //   )
    //   .subscribe(({ response }) => console.log(response));

    // const onClickRaking = clickModal
    //   .pipe(
    //     filter((x) => x.target.classList.contains("ranking"))
    //     // mergeMap(() =>
    //     //   ajax({
    //     //     url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
    //     //     method: "GET",
    //     //   })
    //     // )
    //   )
    //   .subscribe(() => {
    //     this.getState("game").destroy();
    //     routeChange("/ranking");
    //   });

    // const onClickRestart = clickModal
    //   .pipe(filter((x) => x.target.classList.contains("restart")))
    //   .subscribe(() => {
    //     const { isPlaying, setIsPlaying, game } = this.getStates();

    //     setIsPlaying(!isPlaying);
    //     game.restart();
    //   });

    // return [onClickRegister, onClickRaking, onClickRestart];
  }
}

// TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
