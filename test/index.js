const GraysQL = require('../lib/graysql');
const Type = require('../lib/graysql/type');
const Interface = require('../lib/graysql/interface');
const Query = require('../lib/graysql/query');
const Mutation = require('../lib/graysql/mutation');
const LoadFromDir = require('../lib/graysql/extensions/load-from-dir');
const Graylay = require('../lib/graysql/extensions/graylay');


describe('UNIT TESTS', function () {
  describe('GraysQL', function () {
    require('./unit/graysql')(GraysQL);
    require('./unit/graysql/type')(Type);
    require('./unit/graysql/interface')(Interface);
    require('./unit/graysql/query')(Query);
    require('./unit/graysql/mutation')(Mutation);
    describe('@Extensions', function () {
      require('./unit/graysql/extensions/load-from-dir')(GraysQL, LoadFromDir);
      require('./unit/graysql/extensions/graylay')(GraysQL, Graylay);
    });
  });
});
