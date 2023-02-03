import { BehaviorSubject, filter, map, pairwise } from "rxjs";

function updateElement(prev, next, parent, index = 0, parentEl) {
  if (!prev && next) {
    next.render(parent);
    parentEl._children.push(next);
    return;
  }

  if (!next) {
    parent.removeChild(parent.childNodes[index]);
    parentEl._children.splice(index, 1);
    // parentEl._children.splice(index, 1, null); //Bug해결??
    return;
  }

  if (
    (typeof prev === "string" || typeof prev === "number") &&
    (typeof next === "string" || typeof prev === "number")
  ) {
    if (prev !== next) parent.innerText = next;
    return;
  }

  if (typeof prev.tag === "function" || typeof next.tag === "function") {
    updateElement(prev.children, next.template(), parent, index, prev);
    return;
  }

  if (typeof prev.tag !== typeof next.tag) {
    return parent.replaceChild(next.render(parent), parent.childNodes[index]);
  }

  for (const [attr, value] of Object.entries(prev.attrs)) {
    if (prev[attr] !== next[attr]) {
      if (!next[attr]) {
        parent.removeAttribute(attr, value);
      } else {
        parent.setAttribute(attr, value);
      }
    }
  }

  const maxLength = Math.max(prev.children.length, next.children.length);

  // Bug: 중간에 있던 요소가 사라지면 그 뒤의 요소들은 새로운 요소로 판단되어 중복 추가된다.
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      prev.children[i],
      next.children[i],
      parent.childNodes[index],
      i,
      prev
    );
  }
}

export function createElement(tag, props, children) {
  if (typeof tag === "function") {
    return new tag(props);
  }

  if (typeof tag === "string") {
    return new Element(tag, props, children);
  }
}

class Element {
  element;
  constructor(tag, attrs, children = []) {
    this.tag = tag;
    this.attrs = attrs || {};
    this._children = Array.isArray(children)
      ? children.filter((x) => x)
      : [children];
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

export class Component {
  #state;
  #pairState;
  #parent;
  children;
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
    this.tag = this.constructor;
    this.#state = new BehaviorSubject(initialState ?? {});
    this.#pairState = this.#state.pipe(pairwise());

    this.#pairState
      .pipe(
        filter(([prev, cur]) => prev != cur),
        map(([, cur]) => cur)
      )
      .subscribe(() => {
        this.update();
      });
  }

  mount($parent) {
    this.render($parent);
    this.onUnmount = this.onMount();
  }

  render($parent) {
    this.#parent = $parent;
    this.children = this.template(this.#state.getValue());
    const rendered = this.children?.render($parent);
    this.onRender();
    return rendered;
  }

  // Mutation observer 공부하기

  // const cb = (mutationList, observer) => {
  //   console.log(this.$parent.contains(this.$target));
  // };
  // const observer = new MutationObserver(cb);
  // observer.observe(this.$parent, { childList: true });
  update() {
    const next = this.template(this.#state.getValue());
    updateElement(this.children, next, this.#parent);
  }

  onUpdate() {}
  onRender() {}

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

// update로 children node가 추가되면 Element의 _children에도 반영돼야함.

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
