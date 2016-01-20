'use strict';

const DB = require('../db');


module.exports = function (GQL) {
  return {
    name: 'Group',
    fields: {
      id: { type: 'Int' },
      name: { type: 'String' },
      members: { type: '[User]' }
    },
    queries: {
      group: {
        type: 'Group',
        args: {
          id: { type: 'Int' }
        },
        resolve: (_, args) => DB.getGroup(args.id)
      }
    }
  };
}
