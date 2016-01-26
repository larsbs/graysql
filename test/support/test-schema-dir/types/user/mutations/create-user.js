'use strict';


module.exports = function (GQL) {
  return {
    type: 'User',
    args: {
      nick: { type: 'String!' }
    },
    resolve: (_, args) => ({ id: 5, nick: args.nick })
  };
};
