'use strict';

const graphql = require('graphql');
const Utils = require('../utils');


class Type {

  constructor(rawType) {
    if (typeof rawType !== 'object' || Array.isArray(rawType)) {
      throw new TypeError(`GraysQL Error: Expected rawType to be an object, got ${typeof rawType} instead`);
    }

    // Initialize private state
    this._rawType = rawType;

    this._listeners = {
      onGenerateType: [],
      onParseField: []
    };
  }

  generate(types, interfaces) {
    const typeDef = Object.assign({}, this._rawType, {
      fields: () => this._parseFields(this._rawType.fields, types, interfaces)
    });
    return new graphql.GraphQLObjectType(typeDef);
  }

  _parseFields(fields, types, interfaces) {
    const finalFields = {};
    for (const key in fields) {
      finalFields[key] = this._parseField(key, fields[key], types, interfaces);
    }
    return finalFields;
  }

  _parseField(key, field, types) {
    return Object.assign({}, field, {
      type: this._parseFieldType(field.type, types)
    });
  }

  _parseFieldType(type, types) {
    // First try to parse as scalar type
    let parsedType = Utils.parseScalarType(type);
    // Then, try as a dependency
    if ( ! parsedType) {
      if (Utils.isArrayDependency(type)) {
        parsedType = Utils.createArrayDependency(type, types);
      }
      else {
        parsedType = types[type];
      }
    }
    // If everything fails, then return the unparsed type
    if ( ! parsedType) {
      return type;
    }

    return parsedType;
  }

}

module.exports = Type;
