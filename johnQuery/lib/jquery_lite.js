/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const _docReadyCallbacks = [];
let _docReady = false;

window.$l = selector => {
  let elementList;
  switch(typeof(selector)) {
    case "string":
      elementList = document.querySelectorAll(selector);
      return new DOMNodeCollection(elementList);
    case "object":
      if(selector instanceof HTMLElement) {
        return new DOMNodeCollection([selector]);
      }
    case "function":
      return registerDocReadyCallback(selector);
  }
};

registerDocReadyCallback = func => {
  if(!_docReady){
    _docReadyCallbacks.push(func);
  } else {
    func();
  }
};

getNodesFromDom = selector => {
  const nodes = document.querySelectorAll(selector);
  const nodes_array = Array.from(nodes);
  return new DomNodeCollection(nodes_array);
};

$l.extend = (base, ...otherArgs) => {
  otherArgs.forEach(el => {
    Object.keys(el).forEach(key => {
      base[key] = el[key];
    });
  });
  return base;
};

$l.ajax = function(options) {
  const defaults = {
    type: 'GET',
    success: () => {},
    error: () => {},
    url: window.location.href,
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };
  options = $l.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.type, options.url);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.success(JSON.parse(xhr.response));
    } else {
      options.error(JSON.parse(xhr.response));
    }
  };

  xhr.send(options.data);
};


document.addEventListener('DOMContentLoaded', () => {
  _docReady = true;
  _docReadyCallbacks.forEach( func => func() );
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

//prototype methods

  each(cb) {
    this.nodes.forEach(cb);
  }

  html(argument) {
    if (typeof argument === "string") {
      this.each(node => node.innerHTML = argument);
    } else {
      if (this.nodes.length > 0) {
        return this.nodes[0].innerHTML;
      }
    }
  }

  empty() {
    this.html('');
  }

  append(argument) {
    if(this.nodes.length === 0) return;

    if(typeof(argument) === "object" && !(argument instanceof DOMNodeCollection)) {
      argument = $l(children);
    }

    if(typeof argument === "string") {
      this.each(node => node.innerHTML += argument);
    } else if (argument instanceof DOMNodeCollection) {
      this.each(node => {
        node.appendChild(childNode.cloneNode(true));
      });
    }
  }

  attr(name, value) {
    this.nodes.each(node => {
      node.setAttribute(name, value);
    });
  }

  addClass(name) {
    this.nodes.each(node => node.classList.add(name));
  }

  removeClass(name) {
    this.nodes.each(node => node.classList.remove(name));
  }

// traversal
  children() {
    let result = [];
    this.elements.each(el => {
      result = result.concat(Array.from(el.children));
    });

    return new DOMNodeCollection(result);
  }

  parent() {
    let result = [];
    this.elements.each(el => {
      result.push(el.parentNode);
    });

    return new DOMNodeCollection(result);
  }

  find(selector) {
    let result = [];
    this.elements.each(el => {
      let elementList = el.querySelectorAll(selector);
      result = result.concat(Array.from(elementList));
    });
    return result;
  }

  remove() {
    this.elements.each(el => {
      const parent = el.parentNode;
      parent.removeChild(el);
  });
    this.elements = [];
  }

  on(eventName, callback) {
    this.each(node => {
      node.addEventListener(eventName, callback);
      const eventKey = `jqliteEvents-${eventName}`;
      if (typeof node[eventKey] === "undefined") {
        node[eventKey] = [];
      }
      node[eventKey].push(callback);
    });
  }

  off(eventName) {
    this.each(node => {
      const eventKey = `jqliteEvents-${eventName}`;
      if (node[eventKey]) {
        node[eventKey].forEach(callback => {
          node.removeEventListener(eventName, callback);
        });
      }
      node[eventKey] = [];
    });
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);