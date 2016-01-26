'use strict';


module.exports = function (GQL) {
  return {
    type: 'User',
    args: {
      id: { type: 'Int!' }
    },
    resolve: (_, args) => GQL.options.DB.getUser(args.id)
  };
};
