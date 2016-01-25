'use strict';

const Utils = require('../utils');


class Query {

  constructor(rawQuery, listeners) {
    if (typeof rawQuery !== 'object' || Array.isArray(rawQuery)) {
      throw new TypeError(`GraysQL Error: Expected rawQuery to be an object, got ${typeof rawQuery} instead`);
    }

    // Initialize private state
    listeners = listeners || {};
    this._listeners = {
      onParseQueryArg: listeners.onParseQueryArg || [],
      onGenerateQuery: listeners.onGenerateQuery || []
    };
    this._rawQuery = rawQuery;
  }

  generate(types) {
    let queryDef = Object.assign({}, this._rawQuery, {
      type: types[this._rawQuery.type],
      args: this._parseArgs(this._rawQuery.args)
    });
    for (const listener of this._listeners.onGenerateQuery) {
      queryDef = Object.assign(queryDef, listener({ query: queryDef }));
    }
    return queryDef;
  }

  _parseArgs(args) {
    const finalArgs = {};
    for (const key in args) {
      finalArgs[key] = this._parseArg(key, args[key]);
    }
    return finalArgs;
  }

  _parseArg(key, arg) {
    let finalArg = Object.assign({}, arg);
    for (const listener of this._listeners.onParseQueryArg) {
      finalArg = Object.assign(finalArg, listener({ key, arg }));
    }
    return Object.assign({}, finalArg, {
      type: Utils.parseScalarType(finalArg.type)
    });
  }

}

module.exports = Query;
