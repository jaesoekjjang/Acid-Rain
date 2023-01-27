import { fromEvent, BehaviorSubject } from "rxjs";
import { filter, tap, map, mergeMap, share } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

// TODO 컴포넌트로 만들어서 정리하기
export function Modal($target, initialState) {
  const render = (ranking) => {
    $target.innerHTML = `
    <div>
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
    </div>
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
  `;
  };

  // TODO 랭킹 컴포넌트 분리하기.
  const ranking = new BehaviorSubject([]);

  // TODO 1.ajax 함수 추상화 하기  2.에러 처리하기
  const clickModal = fromEvent($target, "click").pipe(share());

  clickModal
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

  clickModal
    .pipe(
      filter((x) => x.target.classList.contains("ranking")),
      mergeMap(() =>
        ajax({
          url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
          method: "GET",
        })
      )
    )
    .subscribe(({ response }) => ranking.next(response));

  ranking.subscribe(render);
}
