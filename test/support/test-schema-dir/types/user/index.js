'use strict';

module.exports = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      group: { type: 'Group' }
    },
    queries: {
      user: require('./queries/user')
    }
  };
};
