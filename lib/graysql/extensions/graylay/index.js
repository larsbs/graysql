'use strict';

module.exports = function () {

  const nodes = {};

  function isConnection(field) {
    return typeof field.type === 'string' && field.type.startsWith('@');
  }

  function cleanFieldType(type) {
    return type.replace('@', '');
  }

  return {

  };

};
