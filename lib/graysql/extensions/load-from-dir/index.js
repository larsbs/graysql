'use strict';

const fs = require('fs');
const path = require('path');


module.exports = function () {
  return {
    load(directory, overwrite) {
      const typesDir = path.join(directory, 'types');
      fs.readdirSync(typesDir)
        .filter(filename => fs.statSync(path.join(typesDir, filename)).isDirectory())
        .map(typeDir => require(`${typesDir}/${typeDir}`))
        .map(type => this.registerType(type, overwrite));
    }
  };
};
