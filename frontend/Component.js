import { BehaviorSubject } from "rxjs";

export class Component {
  #render;

  constructor($target, initialState) {
    if (new.target.prototype.constructor === Component) {
      throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
    }
    this.$target = $target;
    this.state = new BehaviorSubject(initialState ?? {});
    this.state.subscribe((state) => {
      this.render.call(this);
    });
    this.onMount();
    this.addEvent();
  }

  render() {
    this.$target.innerHTML = this.template(this.state.getValue());
  }

  template() {
    throw new Error(
      "Component의 서브 클래스는 template 메소드를 구현해야 합니다."
    );
  }

  onMount() {}

  addEvent() {}

  // beforeUpdate() {}

  // afterUpdate() {}
}

// export function Component($target, initialState) {}

// Component.prototype.update = function () {
//   console.log("update");
// };

// Function.prototype.extend = function (Constructor) {
//   this.prototype = Constructor.prototype;
//   this.prototype.constructor = this;
// };

// const comp = new Component();
// comp.update();
