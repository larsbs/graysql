'use strict';

const graphql = require('graphql');
const Utils = require('../utils');


class Type {

  constructor(rawType, listeners) {
    if (typeof rawType !== 'object' || Array.isArray(rawType)) {
      throw new TypeError(`GraysQL Error: Expected rawType to be an object, got ${typeof rawType} instead`);
    }

    // Initialize private state
    this._rawType = rawType;

    listeners = listeners || {};
    this._listeners = {
      onGenerateType: listeners.onGenerateType || [],
      onParseTypeField: listeners.onParseTypeField || [],
      onParseQueryArg: listeners.onParseQueryArg || [],
    };
  }

  generate(types, interfaces) {
    let typeDef = Object.assign({}, this._rawType, {
      interfaces: () => this._rawType.interfaces ? this._rawType.interfaces.map(iface => interfaces[iface]) : [],
      fields: () => this._parseFields(this._rawType.fields, typeDef, types, interfaces)
    });
    for (const listener of this._listeners.onGenerateType) {
      typeDef = Object.assign(typeDef, listener({ type: typeDef, types, interfaces }));
    }
    return new graphql.GraphQLObjectType(typeDef);
  }

  _parseFields(fields, type, types, interfaces) {
    const finalFields = {};
    for (const key in fields) {
      finalFields[key] = this._parseField(key, fields[key], type, types, interfaces);
    }
    return finalFields;
  }

  _parseField(key, field, type, types) {
    let finalField = Object.assign({}, field);
    for (const listener of this._listeners.onParseTypeField) {
      finalField = Object.assign(finalField, listener({ key, field, type, types }));
    }
    return Object.assign({}, finalField, {
      type: Utils.parseType(finalField.type, types),
      args: this._parseArgs(field.args),
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
    let finalArg = Object.assign({}, arg);
    for (const listener of this._listeners.onParseQueryArg) {
      finalArg = Object.assign(finalArg, listener({ key, arg }));
    }
    return Object.assign({}, finalArg, {
      type: Utils.parseType(finalArg.type)
    });
  }

}

module.exports = Type;
