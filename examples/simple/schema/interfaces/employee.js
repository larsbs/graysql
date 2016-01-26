'use strict';

const UserQueries = require('./queries');
const UserMutations = require('./mutations');


module.exports = function (GQL) {
  return {
    name: 'Employee',
    fields: {
      employeeId: { type: 'String' }
    }
  };
};
