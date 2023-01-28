import { BehaviorSubject, fromEvent } from "rxjs";

export class Component {
  #eventSubscriptions;
  #components;

  /**
   * @param {HTMLElement} $target - 컴포넌트의 컨테이너
   * @param {any} initialState
   */
  constructor($parent, tag, initialState) {
    if (new.target.prototype.constructor === Component) {
      throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
    }
    this.$target = document.createElement(tag);
    $parent.appendChild(this.$target);
    this.$parent = $parent;
    this.state = new BehaviorSubject(initialState ?? {});

    this.addComponents();

    this.state.subscribe((state) => {
      this.render.call(this);
      this.components.forEach((comp) => {
        if (!(comp instanceof Component))
          throw Error("addComponent()에는 컴포넌트만 등록할 수 있습니다");
        comp.render();
      });
    });

    this.onMount();
    this.#eventSubscriptions = this.addEvent();
  }

  render() {
    this.$target.innerHTML = this.template(this.state.getValue());
  }

  /**
   * @param  {...any} components
   */
  addComponents(components = []) {
    this.components = Array.isArray(components) ? components : [components];
  }

  /**
   * @param {any} state
   */
  template(state) {
    // throw new Error(
    //   "Component의 서브 클래스는 template 메소드를 구현해야 합니다."
    // );
  }

  onMount() {}

  /**
   * @returns {Subscription} subscriptions
   * @description 이벤트를 추가한 뒤, subscription을 배열로 반환해야 한다.
   */
  addEvent() {}

  unMount() {
    this.eventSubscriptions.forEach((sub) => sub.unSubscribe());
  }

  //! addEvent가 실행되면 그 결과를 subscription에 넣는 함수

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
