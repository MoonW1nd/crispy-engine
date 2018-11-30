const { Store } = require('./src/js/Store');
const { Actions } = require('./src/js/Actions');
const { Dispatcher } = require('./src/js/Dispatcher');

const iFlux = {
  Store,
  Actions,
  Dispatcher,
};

exports.default = iFlux;
Object.assign(exports, iFlux);
