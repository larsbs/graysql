'use strict';

module.exports = function (GQL) {
  return {
    name: 'Group',
    fields: {
      id: { type: 'Int' },
      name: { type: 'String' },
      members: { type: '[User]' }
    },
    queries: {
      group: require('./queries/group')
    }
  };
};
