'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');


module.exports = function (Utils) {

  describe('@Utils', function () {
    describe('#parseScalarType(type)', function () {
      it('should return GraphQLInt for type `Int`', function () {
        const result = Utils.parseScalarType('Int');
        expect(result).to.equal(graphql.GraphQLInt);
      });
      it('should return GraphQLString for type `String`', function () {
        const result = Utils.parseScalarType('String');
        expect(result).to.equal(graphql.GraphQLString);
      });
      it('should return GraphQLString for type `String`', function () {
        const result = Utils.parseScalarType('Date');
        expect(result).to.equal(graphql.GraphQLString);
      });
      it('should return null for an unknown type', function () {
        const result = Utils.parseScalarType('unknown');
        expect(result).to.be.null;
      });
      it('should return non nullable types when type ends with `!`', function () {
        const intResult = Utils.parseScalarType('Int!');
        const stringResult = Utils.parseScalarType('String!');
        const dateResult = Utils.parseScalarType('Date!');
        expect(intResult).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLInt));
        expect(stringResult).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLString));
        expect(dateResult).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLString));
      });
    });
    describe('#isArrayDependency(type)', function () {
    });
    describe('#createArrayDependency(type, types)', function () {
    });
    describe('#parseFieldType(type, types)', function () {
    });
    describe('#bindAll(listeners, thisArg)', function () {
    });
  });

};
