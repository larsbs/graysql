'use strict';

const Utils = require('../utils');


class Mutation {

  constructor(rawMutation, listeners) {
    if (typeof rawMutation !== 'object' || Array.isArray(rawMutation)) {
      throw new TypeError(`GraysQL Error: Expected rawMutation to be an object, got ${typeof rawMutation} instead`);
    }

    // Initialize private state
    listeners = listeners || {};
    this._listeners = {
      onParseMutationArg: listeners.onParseMutationArg || [],
      onGenerateMutation: listeners.onGenerateMutation || []
    };
    this._rawMutation = rawMutation;
  }

  generate(types) {
    let mutationDef = Object.assign({}, this._rawMutation, {
      type: types[this._rawMutation.type],
      args: this._parseArgs(this._rawMutation.args)
    });
    for (const listener of this._listeners.onGenerateMutation) {
      mutationDef = Object.assign(mutationDef, listener({ mutation: mutationDef }));
    }
    return mutationDef;
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
    for (const listener of this._listeners.onParseMutationArg) {
      finalArg = Object.assign(finalArg, listener({ key, arg }));
    }
    return Object.assign({}, finalArg, {
      type: Utils.parseScalarType(finalArg.type)
    });
  }

}

module.exports = Mutation;
