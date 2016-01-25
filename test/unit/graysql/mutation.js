'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;

const SimpleType = require('../../support/types/simple');


module.exports = function (Mutation) {

  describe('@Mutation', function () {
    describe('#constructor', function () {
      it('should only accept a POJO as parameter', function () {
        expect(() => new Mutation('asdfad')).to.throw(TypeError, /GraysQL Error: Expected rawMutation to be an object/);
        expect(() => new Mutation(x => x)).to.throw(TypeError, /GraysQL Error: Expected rawMutation to be an object/);
        expect(() => new Mutation({})).to.not.throw(TypeError, /GraysQL Error: Expected rawMutation to be an object/);
      });
    });
    describe('#generate(types)', function () {
      let simpleMutation;
      let mutation;
      let Simple;

      let incrementOnParseMutationArg = 1;
      function onParseMutationArg(payload) {
        incrementOnParseMutationArg += 1;
      }

      let incrementOnGenerateMutation = 1;
      function onGenerateMutation(payload) {
        incrementOnGenerateMutation += 1;
      }

      before(function () {
        simpleMutation = SimpleType().mutations.createSimple;
        Simple = new graphql.GraphQLObjectType({
          name: 'Simple',
          fields: () =>({
            id: { type: graphql.GraphQLInt }
          })
        });
      });

      beforeEach(function () {
        mutation = new Mutation(simpleMutation, {
          onParseMutationArg: [onParseMutationArg],
          onGenerateMutation: [onGenerateMutation]
        });
      });

      it('should call onParseMutationArg listeners', function () {
        mutation.generate({ Simple });
        expect(incrementOnParseMutationArg).to.be.above(1);
      });
      it('should call onGenerateMutation listeners', function () {
        expect(incrementOnGenerateMutation).to.be.above(1);
      });
      it('should replace all the types in the mutation with valid GraphQL types', function () {
        expect(mutation.generate({ Simple }).type).to.equal(Simple);
      });
      it('should generate non nullable arguments');
      it('should generate a valid mutation', function () {
        const manMutation = {
          type: Simple,
          args: {
            id: { type: graphql.GraphQLInt }
          },
          resolve: (_, args) => { id: 1 }
        };
        expect(JSON.stringify(mutation.generate({ Simple }))).to.equal(JSON.stringify(manMutation));
      });
    });
  });

};
