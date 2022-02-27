type InputUpperElement = {
  transformUpper: () => void;
  selectionStart: number;
  value: string;
  setSelectionRange: (start: number, end: number) => void;
  children: HTMLCollection;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
};

export default {
  bind(
    el: InputUpperElement,
    _: unknown,
    vnode: {
      componentInstance: { $emit: (event: string, arg1: string) => void };
    }
  ): void {
    el = findInputByNameRecursive(el.children) as InputUpperElement;
    el.transformUpper = () => {
      const start = el.selectionStart;
      el.value = el.value.toUpperCase();
      el.setSelectionRange(start, start);
      vnode.componentInstance.$emit("input", el.value.toUpperCase());
    };
    el.addEventListener("input", () => {
      el.transformUpper();
    });
  },

  unbind(el: InputUpperElement): void {
    el = findInputByNameRecursive(el.children) as InputUpperElement;
    el.removeEventListener("input", el.transformUpper);
  },
};

function findInputByNameRecursive(array: HTMLCollection):
  | unknown
  | {
      transformUpper: () => void;
      selectionStart: number;
      value: string;
      setSelectionRange: (start: number, end: number) => void;
      children: HTMLCollection;
      addEventListener: (event: string, callback: () => void) => void;
    } {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (element.toString() === "[object HTMLInputElement]") {
      return element;
    } else {
      if (element.children) {
        const found = findInputByNameRecursive(element.children);

        if (found) {
          return found;
        }
      }
    }
  }
}
