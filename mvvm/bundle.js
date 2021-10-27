(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { CompileUtil } = require('./util');

class Complier {
  constructor(el, vm) {
    // check the type of el, if not an element node, use get method
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    // store node to storage as fragments
    let fragment = this.node2Fragment(this.el);
    // replace the content in node
    // compile template with data
    this.compile(fragment);
    // add back node to page
    this.el = this.el.appendChild(fragment);
  }

  isDirective(attrName) {
    return attrName.startsWith('v-');
  }

  compileElement(elementNode) {
    const attributes = elementNode.attributes;
    [...attributes].forEach((attr) => {
      const { name, value: expr } = attr;
      if (this.isDirective(name)) {
        const [, directive] = name.split('-');
        CompileUtil[directive](elementNode, expr, this.vm);
      }
    });
  }

  compileText(textNode) {
    const content = textNode.textContent;
    if (/\{\{.+?\}\}/.test(content)) {
      // {{school.name}}
      CompileUtil['text'](textNode, content, this.vm);
    }
  }

  compile(node) {
    const childNodes = node.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        this.compileElement(child);
        this.compile(child);
      } else {
        this.compileText(child);
      }
    });
  }

  node2Fragment(node) {
    const fragment = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = node.firstChild)) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  isElementNode(node) {
    return node.nodeType == 1;
  }
}

module.exports = Complier;

},{"./util":4}],2:[function(require,module,exports){
class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    if (data && typeof data === 'object') {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }
  defineReactive(data, key, value) {
    this.observer(value);
    Object.defineProperty(data, key, {
      get() {
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          this.observer(newVal);
          value = newVal;
        }
      },
    });
  }
}

module.exports = Observer;

},{}],3:[function(require,module,exports){
const Complier = require('./Compiler');
const Observer = require('./Observer');

class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      new Observer(this.$data);
      new Complier(this.$el, this);
    }
  }
}

window.Vue = Vue;

},{"./Compiler":1,"./Observer":2}],4:[function(require,module,exports){
const CompileUtil = {
  getVal(vm, expr) {
    return expr.split('.').reduce((data, current) => {
      return data[current];
    }, vm.$data);
  },
  model(node, expr, vm) {
    const value = this.getVal(vm, expr);
    this.updater.modelUpdater(node, value);
  },
  html() {},
  text(node, expr, vm) {
    // expr {{school.name}}{{school.age}}
    const content = expr.replace(/\{\{(.+?)\}\}/g, (...argus) => {
      return this.getVal(vm, argus[1]);
    });
    this.updater.textUpdater(node, content);
  },
  updater: {
    modelUpdater(node, value) {
      node.value = value;
    },
    htmlUpdater() {},
    textUpdater(node, value) {
      node.textContent = value;
    },
  },
};

module.exports = {
  CompileUtil,
};

},{}]},{},[3]);
