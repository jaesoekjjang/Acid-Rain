import { fromEvent, map, switchMap, tap, timer } from "rxjs";

const keydown = (element) =>
  fromEvent(element, "keydown").pipe(map((e) => e.key));
const keyup = (element) => fromEvent(element, "keyup").pipe(map((e) => e.key));

const enterButton$ = document.querySelector(".enter");
const input$ = document.querySelector(".input");

keydown(document)
  .pipe(
    tap((x) => {
      if (x === "Enter") {
        enterButton$.classList.add("active");
      }
    })
  )
  .subscribe();

keyup(document)
  .pipe(
    tap((x) => {
      if (x === "Enter") {
        enterButton$.classList.remove("active");
      }
    })
  )
  .subscribe();

// 1.5초 동안 타이핑 하지 않으면 input에 'typing' 클래스 부여. => border 스타일 변경
fromEvent(input$, "keydown")
  .pipe(
    switchMap(() => {
      input$.classList.add("typing");
      return timer(1500).pipe(
        tap(() => {
          input$.classList.remove("typing");
        })
      );
    })
  )
  .subscribe();
