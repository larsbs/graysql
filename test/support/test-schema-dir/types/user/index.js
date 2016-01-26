'use strict';

module.exports = function (GQL) {
  return {
    name: 'User',
    interfaces: ['Employee'],
    isTypeOf: obj => obj instanceof GQL.options.DB.User,
    fields: {
      id: { type: 'Int' },
      employeeId: { type: 'String' },
      nick: { type: 'String' },
      group: { type: 'Group' }
    },
    queries: {
      user: require('./queries/user')
    },
    mutations: {
      createUser: require('./mutations/create-user')
    }
  };
};
