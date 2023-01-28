import "../style.css";
import { Modal } from "./component/Modal";
import { Component } from "./Component";
import { GamePanel } from "./component/GamePanel";

new (class App extends Component {
  onMount() {
    import("./keyboardControl");

    const container = document.querySelector(".container");

    // TODO props 함수 추상화 하기
    const modal = new Modal(
      container,
      { tag: "div" },
      {
        isPlaying: () => this.getState("isPlaying"),
        setIsPlaying: (value) => this.setState("isPlaying", value),
        ranking: [],
      }
    );

    const gamePanel = new GamePanel(container, {
      tag: "div",
    });
    this.addComponents([gamePanel, modal]);
  }
})(
  document.querySelector("#app"),
  { tag: "div", attrs: { class: "container" } },
  { isPlaying: true }
);
