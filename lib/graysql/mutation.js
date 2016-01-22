'use strict';

const Utils = require('../utils');


class Mutation {

  constructor(rawMutation) {
    if (typeof rawMutation !== 'object' || Array.isArray(rawMutation)) {
      throw new TypeError(`GraysQL Error: Expected rawMutation to be an object, got ${typeof rawMutation} instead`);
    }

    // Initialize private state
    this._rawMutation = rawMutation;
    this._listeners = {
      onParseArg: [],
      onGenerateMutation: []
    };
  }

  generate(types) {
    return Object.assign({}, this._rawMutation, {
      type: types[this._rawMutation.type],
      args: this._parseArgs(this._rawMutation.args)
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

module.exports = Mutation;
