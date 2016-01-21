'use strict';

const graphql = require('graphql');


module.exports = {

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
    const cleanedType = type.replace(/[\[\]]/, '');
    return new graphql.GraphQLList(types[cleanedType]);
  }

};
