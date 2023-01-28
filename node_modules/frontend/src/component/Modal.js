import { fromEvent } from "rxjs";
import { filter, map, mergeMap, share, tap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Component } from "../Component.js";

export class Modal extends Component {
  template({ props, ranking }) {
    return (
      props.isPlaying() &&
      `
      <div class='modal'>
        <form class='modal-form'>
          <div>
            <span>이름: </span>
            <input type='text' name='name' type="text" />
          </div>
          <div>
            <span>점수: </span>
            <input type='text' name='score' value=10000 >
          </div>
        </form>
        <div>
        <button class='register'>등록하기</button>
        <button class='restart'>다시하기</button>
        <button class='ranking'>랭킹보기</button>
        <div>
          <ul>
            ${ranking.reduce(
              (acc, { name, score }) => `
              ${acc}
              <li>
                <span>이름: ${name}</span>
                <span> | </span>
                <span>점수: ${score}</span>
              </li>
            `,
              ""
            )}
          </ul>
        </div>
      </div>
      </div>
  `
    );
  }

  addEvent() {
    const clickModal = fromEvent(this.$target, "click").pipe(share());

    const onClickRegister = clickModal
      .pipe(
        filter((x) => x.target.classList.contains("register")),
        map(() => {
          const { name, score } = document.querySelector(".modal-form");
          return { userName: name.value, score: score.value };
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
        filter((x) => x.target.classList.contains("ranking")),
        mergeMap(() =>
          ajax({
            url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
            method: "GET",
          })
        )
      )
      .subscribe(({ response }) =>
        this.state.next({ ...this.state.getValue(), ranking: response })
      );

    const onClickRestart = clickModal
      .pipe(filter((x) => x.target.classList.contains("restart")))
      .subscribe(() => {
        const {
          props: { isPlaying, setIsPlaying },
        } = this.state.getValue();
        setIsPlaying(!isPlaying());
      });

    return [onClickRegister, onClickRaking, onClickRestart];
  }
}

// TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
