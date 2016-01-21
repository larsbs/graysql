'use strict';


class GraysQL {

  constructor(options) {
    if (options && typeof options !== 'object') {
      throw new TypeError(`GraysQL Error: Expected options to be an object, got ${typeof options} instead`);
    }

    // Initialize private state
    this._listeners = {};
    this._types = {};

    // Initialize public state
    this.options = Object.assign({}, options);
  }

  use(extension) {
    if (typeof extension !== 'function') {
      throw new TypeError(`GraysQL Error: Expected extension to be a function, got ${typeof extension} instead`);
    }

    extension = extension(GraysQL);

    // Call onInit method of extension
    if (extension.onInit) {
      extension.onInit.bind(this)();
      delete extension.onInit;
    }

    // Mount the extension
    for (const key in extension) {
      if ( ! this._listeners[key]) {
        GraysQL.prototype[key] = extension[key];
      }
      else {
        this._listeners[key].push(extension[key].bind(this));
      }
    }
  }

  registerType(type, overwrite) {
    if (typeof type !== 'function') {
      throw new TypeError(`GraysQL Error: Expected type to be a function, got ${typeof type} instead`);
    }

    const typeObj = type(this);

    if (this._types[typeObj.name] && ! overwrite) {
      throw new Error(`GraysQL Error: Type ${typeObj.name} is already registered`);
    }

    return this._types[typeObj.name] = typeObj;
  }

  generateSchema() {
  }

}


module.exports = GraysQL;
