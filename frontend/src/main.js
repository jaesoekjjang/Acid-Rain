import "../style.css";

import { init } from "./router";
import RankingPage from "./pages/ranking";

import GamePage from "./pages/game";
import HomePage from "./pages/home";

const route = () => {
  const { pathname } = location;
  const $root = document.querySelector("#root");
  $root.innerHTML = "";

  if (pathname === "/game") {
    const $app = document.createElement("div");
    $app.setAttribute("id", "app");

    const canvas = document.createElement("CANVAS");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    $root.insertAdjacentElement("afterbegin", canvas);
    $root.insertAdjacentElement("beforeend", $app);

    return new GamePage({ isPlaying: true }).mount($app);
  }

  if (pathname === "/ranking") {
    return new RankingPage().mount($root);
  }

  return new HomePage().mount($root);
};

init(route);
route();
addEventListener("popstate", route);
