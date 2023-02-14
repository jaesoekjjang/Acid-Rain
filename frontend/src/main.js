import "../style.css";

import { init } from "./router";
import RankingPage from "./pages/ranking";

import GamePage from "./pages/game";
import HomePage from "./pages/home";
import { Component, createElement } from "./Component";

const router = (path) => {
  return (
    {
      "/game": GamePage,
      "/ranking": RankingPage,
    }[path] || HomePage
  );
};

class App extends Component {
  constructor() {
    super();
    const route = this.route.bind(this);

    init(route);
    addEventListener("popstate", route);
  }

  route() {
    const { pathname } = location;
    this.setState("path", pathname);
  }

  template() {
    const path = this.getState("path");
    return createElement("div", null, createElement(router(path)));
  }

  onMount() {
    this.route();
  }
}

const $root = document.querySelector("#root");
new App().mount($root);

// const route = () => {
//   const { pathname } = location;
//   const $root = document.querySelector("#root");
//   $root.innerHTML = "";

//   if (pathname === "/game") {
//     const $app = document.createElement("div");
//     $app.setAttribute("id", "app");

//     // const canvas = document.createElement("CANVAS");

//     // canvas.width = document.body.clientWidth;
//     // canvas.height = document.body.clientHeight;

//     // $root.insertAdjacentElement("afterbegin", canvas);
//     $root.insertAdjacentElement("beforeend", $app);

//     return new GamePage({ isPlaying: true }).mount($app);
//   }

//   if (pathname === "/ranking") {
//     return new RankingPage().mount($root);
//   }

//   return new HomePage().mount($root);
// };

// init(route);
// addEventListener("popstate", route);
// route();
