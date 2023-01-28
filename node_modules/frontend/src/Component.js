import { BehaviorSubject, fromEvent } from "rxjs";

export class Component {
  #eventSubscriptions;
  #components;
  #state;

  /**
   * @param {HTMLElement} $parent - 컴포넌트의 컨테이너
   * @param {string} tag - 컴포넌트 최상위 노드의 태그명
   * @param {any} initialState
   * @example App(document.querySelector('#app'), {tag: 'div', class: 'header'}, {count: 0})
   */
  constructor($parent, { tag = "div", attrs = {} }, initialState) {
    if (new.target.prototype.constructor === Component) {
      throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
    }
    this.$target = document.createElement(tag);
    $parent.appendChild(this.$target);
    this.$parent = $parent;
    this.attrs = attrs;

    this.#state = new BehaviorSubject(initialState ?? {});

    this.addComponents();

    this.#state.subscribe((state) => {
      this.render.call(this);
      this.#components.forEach((comp) => {
        if (!(comp instanceof Component))
          throw Error("addComponent()에는 컴포넌트만 등록할 수 있습니다");
        comp.render();
      });
    });

    this.onMount();
    this.#eventSubscriptions = this.addEvent();
  }

  render() {
    this.$target.innerHTML = this.template(this.#state.getValue());
    Object.keys(this.attrs).forEach((key) => {
      this.$target.setAttribute(key, this.attrs[key]);
    });
  }

  /**
   * @param  {...any} components
   */
  addComponents(components = []) {
    this.#components = Array.isArray(components) ? components : [components];
  }

  /**
   * @param {any} state
   */
  template(state) {
    return null;
  }

  onMount() {}

  /**
   * @returns {Subscription} subscriptions
   * @description 이벤트를 추가한 뒤, subscription을 배열로 반환해야 한다.
   */
  addEvent() {}

  unMount() {
    this.#eventSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  getState(key) {
    return this.#state.getValue()[key];
  }

  getStates(...keys) {
    let res = {};
    for (let key of keys) {
      Object.assign(res, { [key]: this.#state.getValue()[key] });
    }
    return res;
  }

  setState(key, value) {
    this.#state.next({ ...this.#state.getValue(), [key]: value });
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
