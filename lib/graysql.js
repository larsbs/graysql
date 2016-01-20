'use strict';

const Utils = require('./utils');


const _listeners = {
  onInit: []
};

class GraysQL {

  static use(extension) {
    if (typeof extension !== 'function') {
      throw new TypeError(`GraysQL Error: Expected extension to be a function, got ${typeof extension} instead`);
    }

    extension = extension(GraysQL);
    for (const key in extension) {
      if ( ! _listeners[key]) {
        GraysQL.prototype[key] = extension[key];
      }
      else {
        _listeners[key].push(extension[key]);
      }
    }
  }

  constructor(options) {
    if (options && typeof options !== 'object') {
      throw new TypeError(`GraysQL Error: Expected options to be an object, got ${typeof options} instead`);
    }

    this.options = Object.assign({}, options);
    this._listeners = Object.assign({}, _listeners);
    Utils.bindListeners(this._listeners, this);

    // Call onInit listeners
    for (const listener of this._listeners.onInit) {
      listener();
    }
  }

}


module.exports = GraysQL;
