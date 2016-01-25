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
      let query;

      let increaseOnParseQueryArg = 1;
      function onParseQueryArg(payload) {
        increaseOnParseQueryArg += 1;
      }

      let increaseOnGenerateQuery = 1;
      function onGenerateQuery(payload) {
        increaseOnGenerateQuery += 1;
      }

      before(function () {
        Simple = new graphql.GraphQLObjectType({
          name: 'Simple',
          fields: () => ({
            id: { type: graphql.GraphQLInt }
          })
        });

        query = new Query(SimpleType().queries.simple, {
          onParseQueryArg: [onParseQueryArg],
          onGenerateQuery: [onGenerateQuery]
        });
      });

      it('should call onParseQueryArg listeners', function () {
        query.generate({ Simple });
        expect(increaseOnParseQueryArg).to.be.above(1);
      });
      it('should call onGenerateQuery listeners', function () {
        expect(increaseOnGenerateQuery).to.be.above(1);
      });

      it('should replace all the types in the query with valid GraphQL types', function () {
        expect(query.generate({ Simple }).type).to.equal(Simple);
      });

      it('should generate non nullable arguments');
      it('should generate a valid query', function () {
        const manQuery = {
          type: Simple,
          args: {
            id: { type: graphql.GraphQLInt }
          },
          resolve: (_, args) => { id: 1 }
        };
        expect(JSON.stringify(query.generate({ Simple }))).to.equal(JSON.stringify(manQuery));
      });

    });
  });

};
