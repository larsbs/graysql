'use strict';


module.exports = function (GQL) {
  return {
    type: 'User',
    resolve: () => GQL.options.DB.getUsers()
  };
};
