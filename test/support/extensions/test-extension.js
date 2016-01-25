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
    },
    onParseTypeField(payload) {
      if (this && this.options && this.options.increaseOnParseTypeField) {
        this.options.increaseOnParseTypeField += 1;
      }
    },
    onGenerateType(payload) {
      if (this && this.options && this.options.increaseOnGenerateType) {
        this.options.increaseOnGenerateType += 1;
      }
    }
  }
};
