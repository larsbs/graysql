'use strict';

const GraphQLRelay = require('graphql-relay');


module.exports = function () {

  const nodes = {};

  function isConnection(field) {
    return typeof field.type === 'string' && field.type.startsWith('@');
  }

  function isPromisedConnection(field) {
    return isConnection(field) && field.type.startsWith('@>');
  }

  function cleanFieldType(type) {
    return type.replace('@', '').replace('>', '');
  }

  function implementsNodeInterface(type) {
    return !!type.interfaces().find(e => e.name === 'Node');
  }

  return {

    onInit() {
      const nodeIface = GraphQLRelay.nodeDefinitions(globalId => {
        const node = GraphQLRelay.fromGlobalId(globalId);
        return nodes[node.type](node.id);
      }).nodeInterface;
      this.registerInterface(nodeIface);
    },

    onParseTypeField(payload) {
      const type = payload.type;
      const field = payload.field;

      if (implementsNodeInterface(type) && payload.key === 'id') {
        return GraphQLRelay.globalIdField(type.name);
      }

      if (isConnection(field)) {
        return Object.assign({}, field, {
          type: GraphQLRelay.connectionDefinitions({
            name: cleanFieldType(field.type),
            nodeType: payload.types[cleanFieldType(field.type)]
          }).connectionType,
          resolve: (root, args) => {
            if (isPromisedConnection(field)) {
              return GraphQLRelay.connectionFromPromisedArray(field.resolve(root, args), args);
            }
            else {
              return GraphQLRelay.connectionFromArray(field.resolve(root, args), args);
            }
          }
        });
      }
    },

    onGenerateType(payload) {
      const type = payload.type;

      if ( ! implementsNodeInterface(type)) {
        return type;
      }

      if ( ! type.nodeId) {
        throw new Error(`GraysQL Error: Type ${type.name} implements Node interface but doesn't provide a "nodeId" function`);
      }

      nodes[type.name] = type.nodeId;
    }

  };

};
