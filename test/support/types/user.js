'use strict';

const DB = require('../db');


module.exports = function (GQL) {
  return {
    name: 'TestType',
    fields: {
      id: { type: 'Int' },
      name: { type: 'String' },
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
