'use strict';

const graphql = require('graphql');


function parseType(type, dependencies) {
  if (typeof type !== 'string') {
    return type;  // We cannot parse a non string type
  }
  if (type.endsWith('!')) {
    return parseNonNullType(type, dependencies, parseType);
  }
  if (type.startsWith('[')) {
    return parseArrayType(type, dependencies, parseType);
  }

  return parseSimpleType(type, dependencies) || type;
}

function parseSimpleType(type, dependencies) {
  dependencies = dependencies || {};
  switch (type) {
      case 'Int':
        return graphql.GraphQLInt;
      case 'String':
        return graphql.GraphQLString;
      case 'Date':
        return graphql.GraphQLString;
      default:
        return dependencies[type];
  }
}

function parseNonNullType(type, dependencies, next) {
  const cleanedType = type.replace('!', '');
  return new graphql.GraphQLNonNull(next(cleanedType, dependencies));
}

function parseArrayType(type, dependencies, next) {
  const cleanedType = type.replace('[', '').replace(']', '');
  return new graphql.GraphQLList(next(cleanedType, dependencies));
}


module.exports = {
  parseType
};
