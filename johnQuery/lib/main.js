const DOMNodeCollection = require('./dom_node_collection');

const functionQueue = [];
let docReady = false;
document.addEventListener("DOMContentLoaded", execute);

function execute() {
  docReady = true;
  functionQueue.forEach((func) => {
    func();
  });
}

window.$j = function(selector) {
  if (typeof selector === "function") {
    if (docReady) {
      selector();
    } else {
      functionQueue.push(selector);
    }
  } else if (selector instanceof HTMLElement) {
      return new DOMNodeCollection([selector]);
  } else if (typeof selector === "string") {
      const nodeList = document.querySelectorAll(selector);
      const nodeListArray = Array.from(nodeList);
      return new DOMNodeCollection(nodeListArray);
  } else if (selector === window) {
      return new DOMNodeCollection([window]);
  }
};

$j.extend = function(objectA, ...objects) {
  objects.forEach((object) => {
    for (let key in object) {
      objectA[key] = object[key];
    }
  });
  return objectA;
};

$j.ajax = function(options = {}) {
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    data: {},
    success: function() {},
    error: function() {}
  };

  $j.extend(defaults, options);
  const request = new XMLHttpRequest();

  request.open(defaults.method, defaults.url);
  request.onload = function() {
    if (request.status === 200) {
      defaults.success(JSON.parse(request.response));
    } else {
      defaults.error(JSON.parse(request.response));
    }
  };
  request.send(defaults.data);
};

module.exports = $j;
