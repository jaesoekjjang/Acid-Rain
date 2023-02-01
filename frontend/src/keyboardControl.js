import {
  fromEvent,
  map,
  tap,
  pairwise,
  BehaviorSubject,
  switchMap,
} from "rxjs";

// TODO refactor

// const keydown = (element) =>
//   fromEvent(element, "keydown").pipe(map((e) => e.key));
// const keyup = (element) => fromEvent(element, "keyup").pipe(map((e) => e.key));

// const enterButton$ = document.querySelector(".enter");
// // const input$ = document.querySelector(".input");

// keydown(document)
//   .pipe(
//     tap((x) => {
//       if (x === "Enter") {
//         enterButton$.classList.add("active");
//       }
//     })
//   )
//   .subscribe();

// keyup(document)
//   .pipe(
//     tap((x) => {
//       if (x === "Enter") {
//         enterButton$.classList.remove("active");
//       }
//     })
//   )
//   .subscribe();

// fromEvent(input$, "keydown")
//   .pipe(
//     switchMap(() => {
//       input$.classList.add("typing");
//       return timer(1500).pipe(
//         tap(() => {
//           input$.classList.remove("typing");
//         })
//       );
//     })
//   )
//   .subscribe();
