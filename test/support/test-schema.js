'use strict';

const graphql = require('graphql');
const DB = require('./db');


const User = new graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    nick: { type: graphql.GraphQLString },
    group: { type: Group }
  })
});


const Group = new graphql.GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    members: { type: new graphql.GraphQLList(User) }
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
