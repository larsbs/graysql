'use strict';

const TypeParser = require('./type-parser');


module.exports = {

  parseType: TypeParser.parseType,

  bindAll(listeners, thisArg) {
    return listeners.map(l => l.bind(thisArg));
  }

};
