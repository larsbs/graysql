'use strict';

const graphql = require('graphql');
const GraphQLRelay = require('graphql-relay');
const DB = require('./db');


const NodeInterface = GraphQLRelay.nodeDefinitions(globalId => {
  const node = GraphQLRelay.fromGlobalId(globalId);
  switch(node.type) {
      case 'User':
        return DB.getUser(node.id);
      case 'Group':
        return DB.getGroup(node.id);
      default:
        return null;
  }
}).nodeInterface;


const User = new graphql.GraphQLObjectType({
  name: 'User',
  interfaces: [NodeInterface],
  isTypeOf: obj => obj instanceof DB.User,
  fields: () => ({
    id: GraphQLRelay.globalIdField('User'),
    nick: { type: graphql.GraphQLString },
    group: { type: Group }
  })
});


const Group = new graphql.GraphQLObjectType({
  name: 'Group',
  interfaces: [NodeInterface],
  isTypeOf: obj => obj instanceof DB.Group,
  fields: () => ({
    id: GraphQLRelay.globalIdField('Group'),
    name: { type: graphql.GraphQLString },
    members: {
      type: GraphQLRelay.connectionDefinitions({
        name: 'User',
        nodeType: User
      }).connectionType,
      resolve: (group, args) => GraphQLRelay.connectionFromArray(group.members, args)
    }
  })
});


const Query = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    group: {
      type: Group,
      args: {
        id: { type: graphql.GraphQLInt }
      },
      resolve: (_, args) => DB.getGroup(args.id)
    },
    user: {
      type: User,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, args) => DB.getUser(args.id)
    }
  })
});


const Schema = new graphql.GraphQLSchema({
  query: Query
});


module.exports = {
  User,
  Group,
  Query,
  Schema
};
