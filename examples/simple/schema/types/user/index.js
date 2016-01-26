'use strict';

const UserQueries = require('./queries');
const UserMutations = require('./mutations');


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
      user: UserQueries.user,
      users: UserQueries.users
    },
    mutations: {
      createUser: UserMutations.createUser
    }
  };
};
