'use strict';

module.exports = function (GraysQL) {
  return {
    onInit() {
      this.options.increaseOnInit += 1;
      console.log('Called test-extension onInit()');
    },
    customMethod() {
      console.log('Called test-extesion customMethod()');
    }
  }
};
