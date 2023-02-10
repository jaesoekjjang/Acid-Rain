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
      : [children].filter((x) => x !== undefined && x !== null);
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
    this.#state.pipe(skip(1)).subscribe((val) => {
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
    updateElement(this.children, next, this.$parent, this);
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

function updateElement(prev, next, $parent, parentComponent, index = 0) {
  if ((prev === null || prev === undefined) && next) {
    if (typeof next === "object") {
      next.mount($parent);
    } else {
      $parent.innerText = next;
    }
    parentComponent.children.push(next);
    return;
  }

  if (next === null || next === undefined) {
    $parent.removeChild($parent.childNodes[index]);
    parentComponent.children.splice(index, 1);
    return;
  }

  if (
    (typeof prev === "string" || typeof prev === "number") &&
    (typeof next === "string" || typeof next === "number")
  ) {
    if (prev !== next) {
      $parent.innerText = next;
      parentComponent.children = [next];
    }
    return;
  }

  if (typeof prev.tag === "function" && typeof next.tag === "function") {
    // 둘이 다른 컴포넌트이고, 부모가 엘리먼트인 경우
    if (prev.tag !== next.tag) {
      if (parentComponent instanceof Element) {
        $parent.removeChild(prev.children.element);
        next.mount($parent);
        parentComponent.children.splice(index, 1, next);
        return;
      }

      //Bug: Wrapper Element가 없을 때: 의도대로 동작하지 않음
      if (parentComponent instanceof Component) {
        $parent.removeChild(prev.children.element);
        next.mount($parent);
        parentComponent.children = next;
        return;
      }
    }
  }
  // 컴포넌트간 업데이트 기능 추가
  if (typeof prev.tag === "function" || typeof next.tag === "function") {
    //! next가 컴포넌트일 때
    if (typeof next.tag === "function") {
      // 1. prev가 TextNode일 때

      // 2. prev가 Element일 때
      next.children = next.template();
      return updateElement(prev.children, next.children, $parent, prev, index);
    }

    //Bug: Wrapper Element가 없을 때: 의도대로 동작하지 않음
    if (parentComponent instanceof Component) {
      return updateElement(
        prev.children,
        next,
        $parent,
        parentComponent,
        index
      );
    }
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
