import "./style.css";
import { init } from "./counter.js";
import("./keyboardControl");

document.querySelector("#app").innerHTML = `
<div>
  <div class='game__panel'>
    <div>
      <span class="life">❤️</span>
    </div>
    <ul class='words-list'></ul>
    <form>
      <fieldset>
        <input class="input" type="text" />
        <button class='submit' type="submit">
          <img class='enter' src='/enter-key.svg'/>
        </button>
      </fieldset>
    </form>
  </div>
  <div class='game-over__panel play'>
    <div class='game-over__text'>
      <span>Game Over</span>
    </div>
    <div>
      <button class='game-over__button'>
      <span>Play Again</span>
      </button>
    </div>
  </div>
</div>
`;

const WORDS_PATH = "/words_list.txt";

const loadText = async (path) => {
  const text = await (await fetch(path)).text();
  return text;
};
const wordsList = (await loadText(WORDS_PATH))
  .split(/\s+/)
  .sort(() => Math.random() - 0.5);

// TODO start, over, restart 관련 따로 정리하기
export const start = (difficulty) => {
  init(difficulty, wordsList);
  document.querySelector("form").reset();
  document.querySelector(".game-over__panel").classList.add("play");
  document.querySelector("fieldset").disabled = false;
};

start(4);
document
  .querySelector(".game-over__button")
  .addEventListener("click", () => start(3));
