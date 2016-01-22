'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;


module.exports = function (Mutation) {

  describe('@Mutation', function () {
    describe('#constructor', function () {
      it('should only accept a POJO as parameter');
    });
    describe('#generate(types)', function () {
      it('should call onParseArgs listeners');
      it('should call onGenerateMutation listeners');
      it('should replace all the types in the mutation with valid GraphQL types');
      it('should generate a valid mutation');;
    });
  });

};
