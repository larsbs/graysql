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
      onParseTypeField: listeners.onParseTypeField || []
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
      type: Utils.parseType(finalField.type, types)
    });
  }

}

module.exports = Type;
