'use strict';


module.exports = function (GQL) {
  return {
    type: 'User',
    args: {
      nick: { type: 'String!' }
    },
    resolve: (_, args) => GQL.options.DB.createUser(args.nick)
  };
};
