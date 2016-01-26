'use strict';

const graphql = require('graphql');
const expect = require('chai').expect;

const DB = require('../../support/db');
const TestEmployee = require('../../support/test-schema-dir/interfaces/employee');


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
      let testEmployee

      let increaseOnParseInterfaceField = 1;
      function onParseInterfaceField(payload) {
        increaseOnParseInterfaceField += 1;
      }

      let increaseOnGenerateInterface = 1;
      function onGenerateInterface(payload) {
        increaseOnGenerateInterface += 1;
      }

      before(function () {
        Employee = new graphql.GraphQLInterfaceType({
          name: 'Interface',
          fields: () => ({
            employeeId: { type: graphql.GraphQLString }
          })
        });

        testEmployee = new Interface(TestEmployee(), { onParseInterfaceField: [onParseInterfaceField], onGenerateInterface: [onGenerateInterface] }).generate();
      });

      it('should call onParseInterfaceField listeners', function () {
        testEmployee._typeConfig.fields();
        expect(increaseOnParseInterfaceField).to.be.above(1);
      });
      it('should call onGenerateInterface listeners', function () {
        expect(increaseOnGenerateInterface).to.be.above(1);
      });
      it('should generate a valid GraphQLInterfaceType', function () {
        testEmployee = new Interface(TestEmployee()).generate();
        expect(testEmployee).to.include.keys(Object.keys(Employee));
        expect(testEmployee._typeConfig.fields()).to.include.keys(Object.keys(Employee._typeConfig.fields()));
      });
    });
  });

};
