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
