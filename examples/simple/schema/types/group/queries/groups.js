'use strict';


module.exports = function (GQL) {
  return {
    type: 'Group',
    resolve: () => GQL.options.DB.getGroups()
  };
};
