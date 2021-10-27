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
