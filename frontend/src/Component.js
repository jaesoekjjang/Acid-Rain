import { BehaviorSubject, filter, map, pairwise } from "rxjs";

export function createElement(tag, props, children) {
  if (typeof tag === "function") {
    return new tag(props);
  }

  if (typeof tag === "string") {
    return new Element(tag, props, children);
  }
}

export class Component {
  #state;
  #pairState;
  #parent;
  #children;
  /**
   * @param {HTMLElement} $parent - 컴포넌트의 컨테이너
   * @param {Object} target - 컨테이너 바로 아래 최상위 노드
   * @param {string} target.tag - target의 태그명
   * @param {string} target.attrs - target의 속성
   * @param {{[string]: any}} initialState - {키: 밸류} 형식의 객체만 전달 가능합니다. 여기서의 키 값을 getState(), setState() 메서드에 전달해 상태를 조회, 수정할 수 있습니다.
   * @example App(document.querySelector('#app'), {tag: 'div', class: 'header'}, {count: 0})
   */
  constructor(initialState) {
    if (new.target.prototype.constructor === Component) {
      throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
    }

    this.#state = new BehaviorSubject(initialState ?? {});
    this.#pairState = this.#state.pipe(pairwise());

    this.#pairState
      .pipe(
        filter(([prev, cur]) => prev != cur),
        map(([, cur]) => cur)
      )
      .subscribe(() => {
        //! 수정 필요. 자식의 렌더함수에서 처리하는게 좋아보임.
        this.#parent.innerHTML = "";
        this.render(this.#parent);
      });

    // Mutation observer 공부하기

    // const cb = (mutationList, observer) => {
    //   console.log(this.$parent.contains(this.$target));
    // };
    // const observer = new MutationObserver(cb);
    // observer.observe(this.$parent, { childList: true });
  }

  mount($parent) {
    this.render($parent);
    this.onUnmount = this.onMount();
  }

  render($parent) {
    this.#parent = $parent;
    this.#children = this.template(this.#state.getValue());
    const rendered = this.#children?.render($parent);
    this.onRender();
    return rendered;
  }

  onUpdate() {}
  onRender() {}
  // export class Component {
  //   #eventSubscriptions;
  //   #components;
  //   #state;
  //   #pairState;
  //   /**
  //    * @param {HTMLElement} $parent - 컴포넌트의 컨테이너
  //    * @param {Object} target - 컨테이너 바로 아래 최상위 노드
  //    * @param {string} target.tag - target의 태그명
  //    * @param {string} target.attrs - target의 속성
  //    * @param {{[string]: any}} initialState - {키: 밸류} 형식의 객체만 전달 가능합니다. 여기서의 키 값을 getState(), setState() 메서드에 전달해 상태를 조회, 수정할 수 있습니다.
  //    * @example App(document.querySelector('#app'), {tag: 'div', class: 'header'}, {count: 0})
  //    */
  //   constructor($parent, { tag = "div", attrs = {} }, initialState) {
  //     if (new.target.prototype.constructor === Component) {
  //       throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
  //     }

  //     this.$target = document.createElement(tag);
  //     $parent.appendChild(this.$target);
  //     this.$parent = $parent;
  //     this.attrs = attrs;

  //     this.#state = new BehaviorSubject(initialState ?? {});
  //     this.#pairState = this.#state.pipe(pairwise());

  //     this.addComponents();

  //     this.render.call(this);

  //     this.#pairState
  //       .pipe(
  //         filter(([prev, cur]) => prev != cur),
  //         map(([, cur]) => cur)
  //       )
  //       .subscribe(() => {
  //         this.render.call(this);
  //         this.#components.forEach((comp) => {
  //           comp.render();
  //         });
  //       });

  //     // Mutation observer 공부하기
  //     this.onUnmount = this.onMount();
  //     this.#eventSubscriptions = this.addEvent();

  //     // const cb = (mutationList, observer) => {
  //     //   console.log(this.$parent.contains(this.$target));
  //     // };
  //     // const observer = new MutationObserver(cb);
  //     // observer.observe(this.$parent, { childList: true });
  //   }

  //   /**
  //    * @param  {Component[]} components
  //    */
  //   addComponents(components = []) {
  //     this.#components = Array.isArray(components) ? components : [components];
  //   }

  //   render($parent) {
  //     //! App 컴포넌트가 없어짐. template에서 컴포넌트를 생성하도록, 또는 render 함수를 다시 작성
  //     this.$parent = $parent;
  //     this.children = this.template();
  //     const rendered = this.children.render($parent);
  //     return rendered;

  //     this.$parent.appendChild(this.$target);
  //     this.$target.innerHTML = this.template(this.#state.getValue());
  //     Object.keys(this.attrs).forEach((key) => {
  //       this.$target.setAttribute(key, this.attrs[key]);
  //     });
  //   }

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

  getState(key) {
    return this.#state.getValue()[key];
  }

  getStates() {
    return this.#state.getValue();
  }

  setState(key, value) {
    if (value === this.getState(key)) return;
    this.#state.next({ ...this.#state.getValue(), [key]: value });
  }
}

export class MemoComponent extends Component {}

export class Element {
  constructor(tag, attrs, children = []) {
    this.tag = tag;
    this.attrs = attrs || {};
    this._children = Array.isArray(children) ? children : [children];
  }

  render($parent) {
    this.element = document.createElement(this.tag);
    Object.keys(this.attrs).forEach((key) => {
      this.element.setAttribute(key, this.attrs[key]);
    });

    $parent.append(this.element);
    this.children.forEach((child) => {
      if (!child) return;
      if (typeof child === "string" || typeof child === "number") {
        this.element.innerText = child;
      } else {
        child.render(this.element);
      }
    });

    return this.element;
  }

  get children() {
    return this._children;
  }
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
