import { BehaviorSubject, filter, map, pairwise, skip, tap } from "rxjs";

/**
 * @param {Object} tag - 엘리먼트의 태그 명 또는 컴포넌트를 상속받은 클래스
 * @param {string} props - 일반 엘리먼트는 class 또는 id와 같은 속성, 컴포넌트는 초기 상태를 의미한다
 * @param {string | number | Element[] | Component[]} children - 자식 엘리먼트를 배열로 전달
 * @returns {Element | Component}
 * @example createElement('div', {class: 'greet'}, 'hello')
 * @example createElement(App, {id: 'app'}, [createElement(Header, {id: 'header'})])
 */
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
    this.children = Array.isArray(children)
      ? children.filter((x) => x !== undefined && x !== null)
      : [children];
  }

  mount($parent) {
    this.element = document.createElement(this.tag);
    Object.keys(this.attrs).forEach((key) => {
      this.element.setAttribute(key, this.attrs[key]);
    });

    $parent.append(this.element);
    this.children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        this.element.innerText = child;
      } else {
        child.mount(this.element);
      }
    });

    return this.element;
  }
}

export class Component {
  tag;
  $parent;
  children;
  #state;

  /**
   * @param {{[key]: any}} props - {key: value} 형식의 객체만 전달 가능합니다. 여기서의 key값을 getState(), setState() 메서드에 전달해 상태를 조회, 수정할 수 있습니다.
   */
  constructor(props) {
    if (this.constructor === Component) {
      throw new Error("추상 클래스를 인스턴스화 할 수 없습니다.");
    }
    this.tag = this.constructor;
    this.#state = new BehaviorSubject(props ?? {});
    this.#state.pipe(skip(1)).subscribe(() => {
      this.update();
      this.onUpdate();
    });
  }

  mount($parent) {
    this.$parent = $parent;
    this.children = this.template();
    const mounted = this.children?.mount($parent);

    const beforeUnmount = this.onMount();
    this.#unmount(beforeUnmount);

    return mounted;
  }

  template() {}

  /**
   * @description unmount전에 실행할 함수를 onMount의 리턴으로 넘겨주어야 한다.
   */
  onMount() {}

  update() {
    const next = this.template();
    updateElement(this.children, next, this.$parent);
    this.onUpdate();
  }

  onUpdate() {}

  #unmount(callback) {
    const onObserve = (_, observer) => {
      if (!this.$parent.contains(this.children.element)) {
        this.#state.complete();
        callback && callback();
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(onObserve);
    observer.observe(this.$parent, { childList: true });
  }

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

// 중간에 위치한 노드가 바뀔 때 업데이트 에러
// 업데이트 과정에서 컴포넌트의 children과 parent가 없어짐
function updateElement(prev, next, $parent, parentElement, index = 0) {
  if ((prev === null || prev === undefined) && next) {
    next.mount($parent);
    parentElement.children.push(next);
    return;
  }

  if (next === null || next === undefined) {
    $parent.removeChild($parent.childNodes[index]);
    parentElement.children.splice(index, 1);
    // parentElement.children.splice(index, 1, null); //Bug FIX
    return;
  }

  if (
    (typeof prev === "string" || typeof prev === "number") &&
    (typeof next === "string" || typeof prev === "number")
  ) {
    if (prev !== next) {
      $parent.innerText = next;
      parentElement.children = [next];
    }
    return;
  }

  if (typeof prev.tag === "function" || typeof next.tag === "function") {
    // next는 children과 parent가 없음.
    next.children = next.template();
    next.$parent = $parent;
    updateElement(prev.children, next.children, $parent, prev, index);
    return;
  }

  if (typeof prev.tag !== typeof next.tag) {
    return $parent.replaceChild(next.mount($parent), $parent.childNodes[index]);
  }

  for (const [attr, value] of Object.entries(prev.attrs)) {
    if (prev[attr] !== next[attr]) {
      if (!next[attr]) {
        $parent.removeAttribute(attr, value);
      } else {
        $parent.setAttribute(attr, value);
      }
    }
  }

  const maxLength = Math.max(prev.children.length, next.children.length);

  // Bug: 중간에 있던 요소가 사라지면 그 뒤의 요소들은 새로운 요소로 판단되어 중복 추가된다.
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      prev.children[i],
      next.children[i],
      $parent.childNodes[index],
      prev,
      i
    );
  }
}

// update로 children node가 추가되면 Element의 _children에도 반영돼야함.

// export function Component($target, props) {}

// Component.prototype.update = function () {
//   console.log("update");
// };

// Function.prototype.extend = function (Constructor) {
//   this.prototype = Constructor.prototype;
//   this.prototype.constructor = this;
// };

// const comp = new Component();
// comp.update();
