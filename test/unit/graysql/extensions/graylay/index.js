'use strict';

const expect = require('chai').expect;
const GraphQLUtils = require('graphql/utilities');

const DB = require('../../../../support/db');
const TestUser = require('../../../../support/test-schema-dir/relay-types/user');
const TestGroup = require('../../../../support/test-schema-dir/relay-types/group');
const TestSchemaRelay = require('../../../../support/test-schema-relay');


module.exports = function (GraysQL, Graylay) {

  describe('@Graylay', function () {

    let GQL;

    beforeEach(function () {
      GQL = new GraysQL({ DB });
      GQL.use(Graylay);
    });

    it.skip('should generate a valid Relay schema', function () {
      GQL.registerType(TestUser);
      GQL.registerType(TestGroup);
      const result = GraphQLUtils.printSchema(GQL.generateSchema());
      const expected = GraphQLUtils.printSchema(TestSchemaRelay.Schema);
      expect(result).to.equal(expected);
    });

  });

};
