'use strict';

const GraphQLRelay = require('graphql-relay');


module.exports = function () {

  const nodes = {};

  function isConnection(field) {
    return typeof field.type === 'string' && field.type.startsWith('@');
  }

  function cleanFieldType(type) {
    return type.replace('@', '');
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
      console.log('## ON PARSE TYPE FIELD ##');
      console.log(payload);
    },

    onGenerateType(payload) {
      console.log('## ON GENERATE TYPE ##');
      console.log(payload);
    }

  };

};
