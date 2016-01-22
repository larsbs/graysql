'use strict';

module.exports = function (Interface) {

  describe('@Interface', function () {
    describe('#constructor', function () {
      it('should only accept a POJO as parameter');
    });
    describe('#generate(types)', function () {
      it('should call onParseField listeners');
      it('should call onGenerateInterface listeners');
      it('should generate a valid GraphQLObjectType');
    });
  });

};
