'use strict';

const graphql = require('graphql');


let Utils;
module.exports = Utils = {

  parseScalarType(type) {
    switch(type) {
        case 'Int':
          return graphql.GraphQLInt;
        case 'String':
          return graphql.GraphQLString;
        default:
          null;
    }
  },

  isArrayDependency(type) {
    return typeof type === 'string' && type.startsWith('[');
  },

  createArrayDependency(type, types) {
    const cleanedType = type.replace(/[\[\]]/g, '');
    return new graphql.GraphQLList(types[cleanedType]);
  },

  parseFieldType(type, types) {
    if (typeof type !== 'string') {
      return type;
    }

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
  },

  bindAll(listeners, thisArg) {
    return listeners.map(l => l.bind(thisArg));
  }

};
