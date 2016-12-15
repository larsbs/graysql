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

      let increaseOnParseTypeField = 1;
      function onParseTypeField(payload) {
        increaseOnParseTypeField += 1;
      }

      let increaseOnGenerateType = 1;
      function onGenerateType(payload) {
        increaseOnGenerateType += 1;
      }

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
          User: new Type(TestUser({ options: { DB }}), { onParseTypeField: [onParseTypeField], onGenerateType: [onGenerateType] }),
          Group: new Type(TestGroup({ options: { DB }})),
        };

        finalTypes = { User: {}, Group: {} };
        finalTypes['User'] = types['User'].generate(finalTypes);
        finalTypes['Group'] = types['Group'].generate(finalTypes);
      });

      it('should call onParseTypeField listeners', function () {
        types['User'].generate(finalTypes)._typeConfig.fields();
        expect(increaseOnParseTypeField).to.be.above(1);
      });
      it('should call onGenerateType listeners', function () {
        expect(increaseOnGenerateType).to.be.above(1);
      });
      it('should generate a valid GraphQLObjectType', function () {
        expect(finalTypes['User']).to.include.keys(Object.keys(User));
        expect(finalTypes['User']._typeConfig.fields()).to.include.keys(Object.keys(User._typeConfig.fields()));
      });
      it('should parse args in fields', function () {
        expect(finalTypes['User']._typeConfig.fields().dummy).to.include.keys(['args']);
        expect(finalTypes['User']._typeConfig.fields().dummy.args).to.include.keys(['id']);
        expect(finalTypes['User']._typeConfig.fields().dummy.args.id.type.name).to.equal('String');
      });
      it('should link to other GraphQLObjectTypes if specified', function () {
        expect(finalTypes['User']._typeConfig.fields().group.type).to.equal(finalTypes['Group']);
        expect(JSON.stringify(finalTypes['Group']._typeConfig.fields().members.type)).to.equal(JSON.stringify(new graphql.GraphQLList(finalTypes['User'])));
      });
    });
  });

};
