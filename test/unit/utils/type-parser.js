'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');


module.exports = function (TypeParser) {

  describe('@TypeParser', function () {
    describe('#parseType(type, dependencies)', function () {
      it('should parse the types', function () {
        expect(TypeParser.parseType('Int')).to.deep.equal(graphql.GraphQLInt);
        expect(TypeParser.parseType('Int!')).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLInt));
        expect(TypeParser.parseType('[Int]')).to.deep.equal(new graphql.GraphQLList(graphql.GraphQLInt));
        expect(TypeParser.parseType('[Int]!')).to.deep.equal(new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLInt)));
        expect(TypeParser.parseType('String')).to.deep.equal(graphql.GraphQLString);
        expect(TypeParser.parseType('String!')).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLString));
        expect(TypeParser.parseType('[String]')).to.deep.equal(new graphql.GraphQLList(graphql.GraphQLString));
        expect(TypeParser.parseType('[String]!')).to.deep.equal(new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLString)));
      });
    });
  });

};
