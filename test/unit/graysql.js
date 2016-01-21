'use strict';

const expect = require('chai').expect;
const TestExtension = require('../support/extensions/test-extension');
const TestUser = require('../support/types/user');
const TestGroup = require('../support/types/group');


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
        expect(GQL.registerType.bind(GQL, 'asdfa')).to.throw(TypeError, /GraysQL Error/);
      });
      it('should not overwrite a type by default', function () {
        GQL.registerType(TestUser);
        expect(GQL.registerType.bind(GQL, TestUser)).to.throw(Error, /GraysQL Error/);
      });
      it('should allow to overwrite types when specified', function () {
        expect(GQL.registerType.bind(GQL, TestUser, true)).to.not.throw(Error, /GraysQL Error/);
      });
      it('should return the registered type', function () {
        const returnedType = GQL.registerType(TestGroup);
        const type = TestGroup(GQL);
        expect(JSON.stringify(returnedType)).to.equal(JSON.stringify(type));
      });
    });
    describe('#registerInterface(interface, [overwrite])', function () {
      it('should only register functions', function () {
      });
      it('should not overwrite an interface by default', function () {
      });
      it('should allow to overwrite interfaces when specified', function () {
      });
      it('should return the registered interface', function () {
      });
    });
    describe('#addQuery(name, query, [overwrite])', function () {
      it('should only add functions', function () {
      });
      it('should not add a query with an undefined name', function () {
      });
      it('should not add a query with an unknown type', function () {
      });
      it('should not ovewrite a query by default', function () {
      });
      it('should allow to overwrite queries when specified', function () {
      });
      it('should return the added query', function () {
      });
    });
    describe('#addMutation(name, mutation, [ovewrite])', function () {
      it('should only add functions', function () {
      });
      it('should not add a mutation with an undefined name', function () {
      });
      it('should not add a mutation with an unkown type', function () {
      });
      it('should not overwrite a mutation by default', function () {
      });
      it('should allow to overwrite mutations when specified', function () {
      });
      it('should return the added mutation', function () {
      });
    });
    describe('#generateSchema()', function () {
      it('should generate a valid schema', function () {
      });
      it('should generate a schema with all the specified objects', function () {
      });
    });
  });

};
