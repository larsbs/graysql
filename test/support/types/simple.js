'use strict';


module.exports = function (GQL) {
  return {
    name: 'Simple',
    fields: {
      id: { type: 'Int' }
    },
    queries: {
      simple: {
        type: 'Simple',
        args: {
          id: { type: 'Int' }
        },
        resolve: (_, args) => { id: 1}
      }
    },
    mutations: {
      createSimple: {
        type: 'Simple',
        args: {
          id: { type: 'Int' }
        },
        resolve: (_, args) => { id: args.id }
      }
    }
  };
}
