'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;

const DB = require('../../support/db');
const SimpleType = require('../../support/types/simple');
const TestUser = require('../../support/types/user');
const TestGroup = require('../../support/types/group');


module.exports = function (Type) {

  describe('@Type', function () {
    describe('#constructor(rawType)', function () {
      it('should only accept a POJO as parameter', function () {
        expect(() => new Type('adsfa')).to.throw(TypeError, /GraysQL Error: Expected rawType to be an object/);
        expect(() => new Type(x => x)).to.throw(TypeError, /GraysQL Error: Expected rawType to be an object/);
        expect(() => new Type({})).to.not.throw(TypeError, /GraysQL Error: Expected rawType to be an object/);
      });
    });
    describe('#generate(types, interfaces)', function () {
      let User;
      let Group;
      let types;
      let finalTypes;

      before(function () {
        User = new graphql.GraphQLObjectType({
          name: 'User',
          fields: () => ({
            id: { type: graphql.GraphQLInt },
            nick: { type: graphql.GraphQLString },
            group: { type: Group }
          })
        });
        Group = new graphql.GraphQLObjectType({
          name: 'Group',
          fields: () => ({
            id: { type: graphql.GraphQLInt },
            name: { type: graphql.GraphQLString },
            members: { type: new graphql.GraphQLList(User) }
          })
        });

        types = {
          User: new Type(TestUser({ options: { DB }})),
          Group: new Type(TestGroup({ options: { DB }})),
        };

        finalTypes = { User: {}, Group: {} };
        finalTypes['User'] = types['User'].generate(finalTypes);
        finalTypes['Group'] = types['Group'].generate(finalTypes);
      });

      it('should call onParseField listeners');
      it('should call onGenerateType listeners');
      it('should generate a valid GraphQLObjectType', function () {
        expect(finalTypes['User']).to.include.keys(Object.keys(User));
        expect(finalTypes['User']._typeConfig.fields()).to.include.keys(Object.keys(User._typeConfig.fields()));
      });
      it('should link to other GraphQLObjectTypes if specified', function () {
        expect(finalTypes['User']._typeConfig.fields().group.type).to.equal(finalTypes['Group']);
        expect(JSON.stringify(finalTypes['Group']._typeConfig.fields().members.type)).to.equal(JSON.stringify(new graphql.GraphQLList(finalTypes['User'])));
      });
    });
  });

};
