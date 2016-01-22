'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;

const DB = require('../../support/db');
const TestEmployee = require('../../support/interfaces/employee');


module.exports = function (Interface) {

  describe('@Interface', function () {
    describe('#constructor', function () {
      it('should only accept a POJO as parameter', function () {
        expect(() => new Interface('asfa')).to.throw(TypeError, /GraysQL Error: Expected rawInterface to be an object/);
        expect(() => new Interface(x => x)).to.throw(TypeError, /GraysQL Error: Expected rawInterface to be an object/);
        expect(() => new Interface({})).to.not.throw(TypeError, /GraysQL Error: Expected rawInterface to be an object/);
      });
    });
    describe('#generate(types)', function () {
      let Employee;

      before(function () {
        Employee = new graphql.GraphQLInterfaceType({
          name: 'Interface',
          fields: () => ({
            employeeId: { type: graphql.GraphQLString }
          })
        });
      });

      it('should call onParseField listeners');
      it('should call onGenerateInterface listeners');
      it('should generate a valid GraphQLInterfaceType', function () {
        const testEmployee = new Interface(TestEmployee()).generate();
        expect(testEmployee).to.include.keys(Object.keys(Employee));
        expect(testEmployee._typeConfig.fields()).to.include.keys(Object.keys(Employee._typeConfig.fields()));
      });
    });
  });

};
