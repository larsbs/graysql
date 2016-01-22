'use strict';

const graphql = require('graphql');
const Utils = require('../utils');


class Interface {

  constructor(rawInterface) {
    if (typeof rawInterface !== 'object' || Array.isArray(rawInterface)) {
      throw new TypeError(`GraysQL Error: Expected rawInterface to be an object, got ${typeof rawInterface} instead`);
    }

    // Initialize private state
    this._rawInterface = rawInterface;

    this._listeners = {
      onGenerateInterface: [],
      onParseField: []
    };
  }

  generate(types) {
    const ifaceDef = Object.assign({}, this._rawInterface, {
      fields: () => this._parseFields(this._rawInterface.fields, types)
    });
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
    return Object.assign({}, field, {
      type: Utils.parseFieldType(field.type, types)
    });
  }

}

module.exports = Interface;
