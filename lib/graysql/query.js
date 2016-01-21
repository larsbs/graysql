'use strict';

const Utils = require('../utils');


class Query {

  constructor(rawQuery) {
    if (typeof rawQuery !== 'object' || Array.isArray(rawQuery)) {
      throw new TypeError(`GraysQL Error: Expected rawQuery to be an object, got ${typeof rawQuery} instead`);
    }

    // Initialize private state
    this._rawQuery = rawQuery;
  }

  generate(types) {
    return Object.assign({}, this._rawQuery, {
      type: types[this._rawQuery.type],
      args: this._parseArgs(this._rawQuery.args)
    });
  }

  _parseArgs(args) {
    const finalArgs = {};
    for (const key in args) {
      finalArgs[key] = this._parseArg(key, args[key]);
    }
    return finalArgs;
  }

  _parseArg(key, arg) {
    return Object.assign({}, arg, {
      type: Utils.parseScalarType(arg.type)
    });
  }

}

module.exports = Query;
