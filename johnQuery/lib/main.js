const DOMNodeCollection = require("./dom_node_collection.js");

const _docReadyCallbacks = [];
let _docReady = false;

window.$j = selector => {
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

$j.extend = (base, ...otherArgs) => {
  otherArgs.forEach(el => {
    Object.keys(el).forEach(key => {
      base[key] = el[key];
    });
  });
  return base;
};

$j.ajax = function(options) {
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
