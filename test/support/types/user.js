'use strict';

const DB = require('../db');


module.exports = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      group: { type: 'Group' }
    },
    queries: {
      user: {
        type: 'User',
        args: {
          id: { type: 'Int' }
        },
        resolve: (_, args) => DB.getUser(args.id)
      }
    }
  };
}
