'use strict';

const fs = require('fs');
const path = require('path');


function _loadInterfaces(ifacesDir, overwrite) {
  try {
    fs.readdirSync(ifacesDir)
      .map(filename => require(`${ifacesDir}/${filename}`))
      .map(iface => this.registerInterface(iface, overwrite));
  }
  catch (err) {
    console.warn(`WARNING: No interfaces directory found at: ${ifacesDir}`);
  }
}

function _loadTypes(typesDir, overwrite) {
  try {
    fs.readdirSync(typesDir)
      .filter(filename => fs.statSync(path.join(typesDir, filename)).isDirectory())
      .map(typeDir => require(`${typesDir}/${typeDir}`))
      .map(type => this.registerType(type, overwrite));
  }
  catch (err) {
    console.warn(`WARNING: No types directory found at: ${typesDir}`);
  }
}

module.exports = function () {
  return {

    load(directory, overwrite) {
      const ifacesDir = path.join(directory, 'interfaces');
      const typesDir = path.join(directory, 'types');

      _loadInterfaces.call(this, ifacesDir, overwrite);
      _loadTypes.call(this, typesDir, overwrite);
    }

  };
};
