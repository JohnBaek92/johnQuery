class DOMNodeCollection {
  constructor(collection = []) {
    this.collection = collection;
  }

  html(arg) {
    if (arg === undefined) {
      return this.collection[0].innerHTML;
    } else {
      this.collection.forEach((node) => {
        node.innerHTML = arg;
        return;
      });
    }
  }

  empty() {
    return this.html('');
  }

  append(content) {
    if (typeof content === 'string') {
      this.collection.forEach((node) => {
        node.innerHTML += content;
      });
    } else if (content instanceof DOMNodeCollection) {
      this.collection.forEach((parent) => {
        content.collection.forEach((child) => {
          parent.appendChild(child.cloneNode(true));
        });
      });
    }
  }

  attr(key, val) {
    if (val === undefined) {
      return this.collection[0].getAttribute(key);
    } else {
      this.collection[0].setAttribute(key, val);
      return;
    }
  }

  addClass(className) {
    this.collection.forEach(node => node.classList.add(className));
  }

  removeClass(className) {
    this.collection.forEach(node => node.classList.remove(className));
  }

  children() {
    let childrenCollection = [];
    this.collection.forEach((childElement) => {
      childrenCollection = childrenCollection.concat(childElement.children);
    });

    return new DOMNodeCollection(childrenCollection);
  }

  parent() {
    let parentCollection = [];
    this.collection.forEach((childElement) => {
      parentCollection = parentCollection.concat(childElement.parentElement);
    });

    return new DOMNodeCollection(parentCollection);
  }

  find(selector) {
    let selectorNodes = [];
    this.collection.forEach((node) => {
      const allNodes = node.querySelectorAll(selector);
      selectorNodes = selectorNodes.concat(Array.from(allNodes));
    });
    return new DOMNodeCollection(selectorNodes);
  }

  remove() {
    this.collection.forEach(node => node.parentNode.removeChild(node));
  }

  on(e, callback) {
    this.collection.forEach((node) => {
      node.addEventListener(e, callback);
      node.eventCallBack = callback;
    });
    return;
  }

  off(e) {
    this.collection.forEach((node) => {
      const callback = node.eventCallBack;
        node.removeEventListener(e, callback);
    });
  }

  eq(idx) {
    return new DOMNodeCollection([this.collection[idx]]);
  }
}

module.exports = DOMNodeCollection;
