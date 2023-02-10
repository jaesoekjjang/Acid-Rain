// import { fromEvent, map, tap } from "rxjs";

// // TODO refactor

// const keydown = (element) =>
//   fromEvent(element, "keydown").pipe(map((e) => e.key));
// const keyup = (element) => fromEvent(element, "keyup").pipe(map((e) => e.key));

// const enterButton$ = document.querySelector(".enter");

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
