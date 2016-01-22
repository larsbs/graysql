const GraysQL = require('../lib/graysql');
const Type = require('../lib/graysql/type');
const Interface = require('../lib/graysql/interface');
const Query = require('../lib/graysql/query');
const Mutation = require('../lib/graysql/mutation');


describe('UNIT TESTS', function () {
  describe('GraysQL', function () {
    require('./unit/graysql')(GraysQL);
    require('./unit/graysql/type')(Type);
    require('./unit/graysql/interface')(Interface);
    require('./unit/graysql/query')(Query);
    require('./unit/graysql/mutation')(Mutation);
  });
});
