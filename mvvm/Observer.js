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
