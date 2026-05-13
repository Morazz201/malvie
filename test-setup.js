const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
});

global.window = jsdom.window;
global.document = jsdom.window.document;
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'node.js',
  },
  configurable: true,
});
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
Object.defineProperty(window, 'localStorage', {
  value: (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => { store[key] = value.toString(); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })(),
  writable: true
});
global.localStorage = window.localStorage;
global.IS_REACT_ACT_ENVIRONMENT = true;
