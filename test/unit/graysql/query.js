'use strict';

module.exports = function (Query) {

  describe('@Query', function () {
    describe('#constructor(rawQuery)', function () {
      it('should only accept an object as parameter');
    });
    describe('#generate(types)', function () {
      it('should call onParseArgs listeners');
      it('should call onGenerateQuery listeners');
      it('should replace all the types in the query by valid GraphQL types');
    });
  });

};
