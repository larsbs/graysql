'use strict';

const GroupQueries = require('./queries');
const GroupMutations = require('./mutations');


module.exports = function (GQL) {
  return {
    name: 'Group',
    isTypeOf: obj => obj instanceof GQL.options.DB.Group,
    fields: {
      id: { type: 'Int' },
      name: { type: 'String' },
      members: { type: '[User]' }
    },
    queries: {
      group: GroupQueries.group,
      groups: GroupQueries.groups
    },
    mutations: {
      createGroup: GroupMutations.createGroup
    }
  };
};
