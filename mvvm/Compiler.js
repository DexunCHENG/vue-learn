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
