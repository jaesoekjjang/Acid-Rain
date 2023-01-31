import { MemoComponent } from "../Component";
import("../keyboardControl");

export class GamePanel extends MemoComponent {
  template() {
    return `
    <div class='game__panel'>
      <div>
        <span class="life">❤️</span>
      </div>
      <ul class='words-list'></ul>
      <form class='game-form'>
        <fieldset class='game-fieldset'>
          <input class="input" type="text" />
          <button class='submit' type="submit">
            <img class='enter' src='/enter-key.svg'/>
          </button>
        </fieldset>
      </form>
    </div>
    `;
  }

  onMount() {}
}
