'use strict';

const DB = require('../db');


module.exports = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      group: { type: 'Group' },
      dummy: {
        type: 'String',
        args: {
          id: { type: 'String' },
        },
        resolve: () => 'Hello dummy!',
      },
    },
    queries: {
      user: {
        type: 'User',
        args: {
          id: { type: 'Int!' }
        },
        resolve: (_, args) => DB.getUser(args.id)
      }
    },
    mutations: {
      createUser: {
        type: 'User',
        args: {
          nick: { type: 'String!' },
        },
        resolve: (_, args) => ({
          id: 5,
          nick: args.nick
        })
      }
    }
  };
}
