import "../style.css";
import { Modal } from "./component/Modal";
import { Component } from "./Component";
import { fromEvent } from "rxjs";
import { GamePanel } from "./component/GamePanel";

new (class App extends Component {
  onMount() {
    import("./keyboardControl");
    const app = document.querySelector("#app");

    // TODO props 함수 추상화 하기
    const modal = new Modal(app, "div", {
      props: {
        isPlaying: () => this.state.getValue().isPlaying,
        setIsPlaying: (isPlaying) =>
          this.state.next({ ...this.state.getValue(), isPlaying }),
      },
      ranking: [],
    });

    const gamePanel = new GamePanel(app, "div");
    this.addComponents([gamePanel, modal]);
  }
})(document.querySelector("#app"), "div", { isPlaying: true });
