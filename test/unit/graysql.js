'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');

const DB = require('../support/db');
const TestExtension = require('../support/extensions/test-extension');
const TestUser = require('../support/types/user');
const TestGroup = require('../support/types/group');
const SimpleType = require('../support/types/simple');


module.exports = function (GraysQL) {

  describe('@GraysQL', function () {

    describe('#constructor([options])', function () {
      it('should only accepts an object as options', function () {
        expect(() => new GraysQL('asdf')).to.throw(TypeError, /GraysQL Error/);
      });
      it('should put received options in the options property', function () {
        const GQL = new GraysQL({ test: 'testOption' });
        expect(GQL.options).to.contain.key('test');
      });
    });

    describe('#use(extension)', function () {
      const GQL = new GraysQL({ increaseOnInit: 1 });
      before(function () {
        GQL.use(TestExtension);
      });
      it('should only accept functions', function () {
        expect(GQL.use.bind(GraysQL, 'asdf')).to.throw(TypeError, /GraysQL Error/);
      });
      it('should call onInit method in the extension', function () {
        expect(GQL.options.increaseOnInit).to.be.greaterThan(1);
      });
      it('should merge non listeners with the prototype', function () {
        expect(GraysQL.prototype).to.contain.key('customMethod');
      });
      it('should pass GraysQL to the extensions', function () {
        expect(GQL.customMethod()).to.equal(GraysQL);
      });
      it('should not merge listeners with the prototype', function () {
        expect(GraysQL.prototype).to.not.contain.key('onInit');
      });
    });

    describe('#registerType(type, [overwrite])', function () {
      let GQL;
      before(function () {
        GQL = new GraysQL();
      });
      it('should only register functions', function () {
        expect(GQL.registerType.bind(GQL, 'asdfa')).to.throw(TypeError, /GraysQL Error: Expected type to be a function/);
      });
      it('should not overwrite a type by default', function () {
        GQL.registerType(TestUser);
        expect(GQL.registerType.bind(GQL, TestUser)).to.throw(Error, /GraysQL Error: Type /);
      });
      it('should allow to overwrite types when specified', function () {
        expect(GQL.registerType.bind(GQL, TestUser, true)).to.not.throw(Error, /GraysQL Error: Type /);
      });
      it('should return the registered type', function () {
        const returnedType = GQL.registerType(TestGroup);
        const type = TestGroup(GQL);
        expect(JSON.stringify(returnedType)).to.equal(JSON.stringify(type));
      });
    });

    describe('#registerInterface(interface, [overwrite])', function () {
      it('should only register functions');
      it('should not overwrite an interface by default');
      it('should allow to overwrite interfaces when specified');
      it('should return the registered interface');
    });

    describe('#addQuery(name, query, [overwrite])', function () {
      let GQL;
      beforeEach(function () {
        GQL = new GraysQL();
      });
      it('should only add functions', function () {
        expect(GQL.addQuery.bind(GQL, 'adfs', 'asdfa')).to.throw(TypeError, /GraysQL Error: Expected query to be a function/);
        expect(GQL.addQuery.bind(GQL, 'adfs', x => x)).to.not.throw(TypeError, /GraysQL Error: Expected query to be a function/);
      });
      it('should not add a query with an undefined name', function () {
        const user = (GQL) => TestUser().queries.user;
        expect(GQL.addQuery.bind(GQL, null, user)).to.throw(Error, /GraysQL Error: Missing query name/);
        expect(GQL.addQuery.bind(GQL, undefined, user)).to.throw(Error, /GraysQL Error: Missing query name/);
        expect(GQL.addQuery.bind(GQL, '', user)).to.throw(Error, /GraysQL Error: Missing query name/);
      });
      it('should not ovewrite a query by default', function () {
        const q = (GQL) => ({
          type: 'Simple',
          args: { id: { type: 'Int' } },
          resolve: (_, args) => { id: 1 }
        });
        GQL.addQuery('Simple', q);
        expect(GQL.addQuery.bind(GQL, 'Simple', q)).to.throw(Error, /GraysQL Error/);
      });
      it('should allow to overwrite queries when specified', function () {
        const q = (GQL) => ({
          type: 'Simple',
          args: { id: { type: 'Int' } },
          resolve: (_, args) => { id: 1 }
        });
        GQL.addQuery('Simple', q);
        expect(GQL.addQuery.bind(GQL, 'Simple', q, true)).to.not.throw(Error, /GraysQL Error/);
      });
      it('should return the added query', function () {
        const q = (GQL) => ({
          type: 'Simple',
          args: { id: { type: 'Int' } },
          resolve: (_, args) => { id: 1 }
        });
        expect(JSON.stringify(GQL.addQuery('Simple', q))).to.equal(JSON.stringify(q(GQL)));
      });
    });

    describe('#addMutation(name, mutation, [ovewrite])', function () {
      let GQL;
      beforeEach(function () {
        GQL = new GraysQL();
      });
      it('should only add functions', function () {
        expect(GQL.addMutation.bind(GQL, 'asdfadf', 'asfa')).to.throw(TypeError, /GraysQL Error: Expected mutation to be a function/);
        expect(GQL.addMutation.bind(GQL, 'asdfadf', x => x)).to.not.throw(TypeError, /GraysQL Error: Expected mutation to be a function/);
      });
      it('should not add a mutation with an undefined name', function () {
        const user = (GQL) => TestUser().mutations.createUser;
        expect(GQL.addMutation.bind(GQL, null, user)).to.throw(Error, /GraysQL Error: Missing mutation name/);
        expect(GQL.addMutation.bind(GQL, undefined, user)).to.throw(Error, /GraysQL Error: Missing mutation name/);
        expect(GQL.addMutation.bind(GQL, '', user)).to.throw(Error, /GraysQL Error: Missing mutation name/);
      });
      it('should not overwrite a mutation by default', function () {
        GQL.registerType(TestUser);
        const user = (GQL) => TestUser().mutations.createUser;
        expect(GQL.addMutation.bind(GQL, 'createUser', user)).to.throw(Error, /GraysQL Error: Mutation/);
      });
      it('should allow to overwrite mutations when specified', function () {
        GQL.registerType(TestUser);
        const user = (GQL) => TestUser().mutations.createUser;
        expect(GQL.addMutation.bind(GQL, 'createUser', user, true)).to.not.throw(Error, /GraysQL Error: Mutation/);
      });
      it('should return the added mutation', function () {
        const user = (GQL) => TestUser().mutations.createUser;
        expect(JSON.stringify(GQL.addQuery('createUser', user))).to.equal(JSON.stringify(user(GQL)));
      });
    });

    describe('#generateSchema()', function () {
      let GQL;
      let manualSchema;
      before(function () {
        GQL = new GraysQL();
        GQL.registerType(TestUser);
        GQL.registerType(TestGroup);

        const User = new graphql.GraphQLObjectType({
          name: 'User',
          fields: () => ({
            id: { type: graphql.GraphQLInt },
            nick: { type: graphql.GraphQLString },
            group: { type: Group }
          })
        });
        const Group = new graphql.GraphQLObjectType({
          name: 'Group',
          fields: () => ({
            id: { type: graphql.GraphQLInt },
            name: { type: graphql.GraphQLString },
            members: { type: new graphql.GraphQLList(User) }
          })
        });
        const Query = new graphql.GraphQLObjectType({
          name: 'Query',
          fields: () => ({
            user: {
              type: User,
              args: {
                id: { type: graphql.GraphQLInt }
              },
              resolve: (_, args) => DB.getUser(args.id)
            },
            group: {
              type: Group,
              args: {
                id: { type: graphql.GraphQLInt }
              },
              resolve: (_, args) => DB.getGroup(args.id)
            }
          })
        });
        manualSchema = new graphql.GraphQLSchema({
          query: Query
        });
      });
      it('should generate a valid schema', function (done) {
        expect(GQL.generateSchema.bind(GQL)).to.not.throw(Error);
        const Schema = GQL.generateSchema();
        const query = `query GetUser {
          user(id: 1) {
            id,
            nick,
            group {
              id,
              name,
              members {
                id
              }
            }
          }
        }`;
        const expected = {
          data: {
            user: {
              id: 1,
              nick: 'Lars',
              group: {
                id: 1,
                name: 'Group 1',
                members: [{
                  id: 1
                }, {
                  id: 2
                }]
              }
            }
          }
        };
        graphql.graphql(Schema, query).then(result => {
          expect(result).to.deep.equal(expected);
          done();
        });
      });
      it('should generate a schema with all the specified objects', function () {
        const strGenSchema = GraphQLUtils.printSchema(GQL.generateSchema());
        const strManSchema = GraphQLUtils.printSchema(manualSchema);
        expect(strGenSchema).to.equal(strManSchema);
      });
    });
  });

};
