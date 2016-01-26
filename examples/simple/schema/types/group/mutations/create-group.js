'use strict';


module.exports = function (GQL) {
  return {
    type: 'Group',
    args: {
      name: { type: 'String!' }
    },
    resolve: (_, args) => GQL.options.DB.createGroup(args.name)
  };
};
