'use strict';

module.exports = function (GQL) {
  return {
    name: 'User',
    interfaces: ['Node'],
    nodeId: id => GQL.options.DB.getUser(id),
    isTypeOf: obj => obj instanceof GQL.options.DB.User,
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
