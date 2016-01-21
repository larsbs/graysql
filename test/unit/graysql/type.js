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
        expect(() => new Type('adsfa')).to.throw(TypeError, /GraysQL Error/);
        expect(() => new Type(x => x)).to.throw(TypeError, /GraysQL Error/);
        expect(() => new Type({})).to.not.throw(TypeError, /GraysQL Error/);
      });
    });
    describe('#generate(types, interfaces)', function () {
      it('should call onParseField listeners');
      it('should call onGenerateType listeners');
      it('should generate a valid GraphQLObjectType', function () {
        const Simple = new graphql.GraphQLObjectType({
          name: 'Simple',
          fields: () => ({
            id: { type: graphql.GraphQLInt }
          })
        });
        const genType = new Type(SimpleType());
        expect(genType.generate()).to.include.keys(Object.keys(Simple));
        expect(genType.generate()._typeConfig.fields()).to.include.keys(Object.keys(Simple._typeConfig.fields()));
      });
      it('should link to other GraphQLObjectTypes if specified', function () {
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

        const types = {
          User: TestUser({ options: { DB }}),
          Group: TestGroup({ options: { DB }})
        };

        const user = new Type(types['User']);
        const group = new Type(types['Group']);

        types['User'] = user.generate(types);
        types['Group'] = group.generate(types);

        expect(types['User']._typeConfig.fields().group.type).to.equal(types['Group']);
      });
    });
  });

};
