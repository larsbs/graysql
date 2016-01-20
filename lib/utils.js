'use strict';

module.exports = {

  bindListeners(listeners, thisArg) {
    for (const category in listeners) {
      listeners[category] = listeners[category].map(l => l.bind(thisArg));
    }
  }

};
