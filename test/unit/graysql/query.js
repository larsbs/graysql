'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;

const SimpleType = require('../../support/types/simple');


module.exports = function (Query) {

  describe('@Query', function () {

    describe('#constructor(rawQuery)', function () {
      it('should only accept a POJO as parameter', function () {
        expect(() => new Query('asdfad')).to.throw(TypeError, /GraysQL Error/);
        expect(() => new Query(x => x)).to.throw(TypeError, /GraysQL Error/);
        expect(() => new Query({})).to.not.throw(TypeError, /GraysQL Error/);
      });
    });

    describe('#generate(types)', function () {
      let Simple;
      before(function () {
        Simple = new graphql.GraphQLObjectType({
          name: 'Simple',
          fields: () => ({
            id: { type: graphql.GraphQLInt }
          })
        });
      });

      it('should call onParseArgs listeners');
      it('should call onGenerateQuery listeners');

      it('should replace all the types in the query with valid GraphQL types', function () {
        const query = new Query(SimpleType().queries.simple);
        expect(query.generate({ Simple }).type).to.equal(Simple);
      });

      it('should generate a valid query', function () {
        const manQuery = {
          type: Simple,
          args: {
            id: { type: graphql.GraphQLInt }
          },
          resolve: (_, args) => { id: 1 }
        };
        const query = new Query(SimpleType().queries.simple);
        expect(JSON.stringify(query.generate({ Simple }))).to.equal(JSON.stringify(manQuery));
      });

    });
  });

};
