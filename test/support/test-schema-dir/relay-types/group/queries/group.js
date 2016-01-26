'use strict';


module.exports = function (GQL) {
  return {
    type: 'Group',
    args: {
      id: { type: 'Int' }
    },
    resolve: (_, args) => GQL.options.DB.getGroup(args.id)
  };
}
