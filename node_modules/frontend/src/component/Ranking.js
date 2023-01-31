import { ajax } from "rxjs/ajax";
import { take } from "rxjs";
import { Component } from "../Component.js";

export class Ranking extends Component {
  template({ ranking }) {
    return `
      <header>헤더</header>

      <ul>
        <hr />
        ${ranking?.reduce(
          (acc, { name, score }, index) => `
        ${acc}
        <li>
          <span>${index + 1}위</span>
          <span> | </span>
          <span>이름: ${name}</span>
          <span> | </span>
          <span>점수: ${score}</span>
        </li>
        <hr />
      `,
          ""
        )}
    </ul>
    `;
  }

  onMount() {
    ajax({
      url: `${import.meta.env.VITE_BASE_URL}/game/ranking`,
      method: "GET",
    })
      .pipe(take(30))
      .subscribe(({ response }) => this.setState("ranking", response));
  }
}
