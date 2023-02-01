import { fromEvent } from "rxjs";
import { filter, map, mergeMap, share, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Component } from "../Component.js";
import { routeChange } from "../router.js";

export class Modal extends Component {
  template({ isPlaying, score }) {
    return isPlaying()
      ? ""
      : `
      <div class='modal-background'>
        <div class='modal'>
          <form class='modal-form'>
            <div>
              <input class='name-input' type='text' name='name' type="text" placeholder='이름'/>
              <input class='score-input' type='text' name='score' value='${score()}점' disabled>
            </div>
            <div>
              <button class='register'>랭킹 등록하기</button>
            </div>
          </form>
          <div>
            <button class='restart'>다시하기</button>
            <button class='ranking'>랭킹보기</button>
          </div>
      </div>
      </div>
  `;
  }

  addEvent() {
    const clickModal = fromEvent(this.$target, "click").pipe(share());

    const onClickRegister = clickModal
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

    const onClickRaking = clickModal
      .pipe(
        filter((x) => x.target.classList.contains("ranking"))
        // mergeMap(() =>
        //   ajax({
        //     url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
        //     method: "GET",
        //   })
        // )
      )
      .subscribe(() => {
        this.getState("game").destroy();
        routeChange("/ranking");
      });

    const onClickRestart = clickModal
      .pipe(filter((x) => x.target.classList.contains("restart")))
      .subscribe(() => {
        const { isPlaying, setIsPlaying, game } = this.getStates(
          "isPlaying",
          "setIsPlaying",
          "game"
        );

        setIsPlaying(!isPlaying());
        game.restart();
      });

    return [onClickRegister, onClickRaking, onClickRestart];
  }
}

// TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
