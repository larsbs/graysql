'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');


module.exports = function (TypeParser) {

  describe('@TypeParser', function () {
    let SimpleType;
    before(function () {
      SimpleType = new graphql.GraphQLObjectType({
        name: 'Simple',
        fields: () => ({
          id: { type: graphql.GraphQLInt }
        })
      });
    });
    describe('#parseType(type, dependencies)', function () {
      it('should parse simple types: `Int`, `String`, dependencies, etc', function () {
        expect(TypeParser.parseType('Int')).to.deep.equal(graphql.GraphQLInt);
        expect(TypeParser.parseType('String')).to.deep.equal(graphql.GraphQLString);
        expect(TypeParser.parseType('Simple', { 'Simple': SimpleType })).to.deep.equal(SimpleType);
      });
      it('should parse array versions of the simple types', function () {
        expect(TypeParser.parseType('[Int]')).to.deep.equal(new graphql.GraphQLList(graphql.GraphQLInt));
        expect(TypeParser.parseType('[String]')).to.deep.equal(new graphql.GraphQLList(graphql.GraphQLString));
        expect(TypeParser.parseType('[Simple]', { 'Simple': SimpleType })).to.deep.equal(new graphql.GraphQLList(SimpleType));
      });
      it('should parse non nullable versions of all types', function () {
        expect(TypeParser.parseType('Int!')).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLInt));
        expect(TypeParser.parseType('[Int]!')).to.deep.equal(new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLInt)));
        expect(TypeParser.parseType('String!')).to.deep.equal(new graphql.GraphQLNonNull(graphql.GraphQLString));
        expect(TypeParser.parseType('[String]!')).to.deep.equal(new graphql.GraphQLNonNull(new graphql.GraphQLList(graphql.GraphQLString)));
        expect(TypeParser.parseType('Simple!', { 'Simple': SimpleType })).to.deep.equal(new graphql.GraphQLNonNull(SimpleType));
        expect(TypeParser.parseType('[Simple]!', { 'Simple': SimpleType })).to.deep.equal(new graphql.GraphQLNonNull(new graphql.GraphQLList(SimpleType)));
      });
    });
  });

};
