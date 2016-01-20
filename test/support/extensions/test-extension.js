'use strict';

module.exports = function (GraysQL) {
  return {
    onInit() {
      if (this && this.options && this.options.increaseOnInit) {
        this.options.increaseOnInit += 1;
      }
    },
    customMethod() {
      return GraysQL;
    }
  }
};
