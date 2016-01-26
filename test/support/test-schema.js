'use strict';

const graphql = require('graphql');
const DB = require('./db');


const Employee = new graphql.GraphQLInterfaceType({
  name: 'Employee',
  fields: () => ({
    employeeId: { type: graphql.GraphQLString }
  })
});


const User = new graphql.GraphQLObjectType({
  name: 'User',
  interfaces: () => [Employee],
  isTypeOf: obj => obj instanceof DB.User,
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    employeeId: { type: graphql.GraphQLString },
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


const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: User,
      args: {
        nick: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, args) => ({ id: 5, nick: args.nick })
    }
  })
});


const Schema = new graphql.GraphQLSchema({
  query: Query,
  mutation: Mutation
});


module.exports = {
  User,
  Group,
  Query,
  Schema
};
