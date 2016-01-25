'use strict';

const graphql = require('graphql');
const Utils = require('../utils');


class Interface {

  constructor(rawInterface, listeners) {
    if (typeof rawInterface !== 'object' || Array.isArray(rawInterface)) {
      throw new TypeError(`GraysQL Error: Expected rawInterface to be an object, got ${typeof rawInterface} instead`);
    }

    // Initialize private state
    this._rawInterface = rawInterface;

    listeners = listeners || {};
    this._listeners = {
      onGenerateInterface: listeners.onGenerateInterface || [],
      onParseInterfaceField: listeners.onParseInterfaceField || []
    };
  }

  generate(types) {
    let ifaceDef = Object.assign({}, this._rawInterface, {
      fields: () => this._parseFields(this._rawInterface.fields, types)
    });
    for (const listener of this._listeners.onGenerateInterface) {
      ifaceDef = Object.assign(ifaceDef, listener({ iface: ifaceDef, types }));
    }
    return new graphql.GraphQLInterfaceType(ifaceDef);
  }

  _parseFields(fields, types) {
    const finalFields = {};
    for (const key in fields) {
      finalFields[key] = this._parseField(key, fields[key], types);
    }
    return finalFields;
  }

  _parseField(key, field, types) {
    let finalField = Object.assign({}, field);
    for (const listener of this._listeners.onParseInterfaceField) {
      finalField = Object.assign(finalField, listener({ key, field, types }));
    }
    return Object.assign({}, finalField, {
      type: Utils.parseFieldType(finalField.type, types)
    });
  }

}

module.exports = Interface;
