'use strict';

const path = require('path');
const expect = require('chai').expect;
const GraphQLUtils = require('graphql/utilities');

const DB = require('../../../support/db');
const TestSchema = require('../../../support/test-schema');
const TestUser = require('../../../support/test-schema-dir/types/user');


module.exports = function (GraysQL, LoadFromDir) {

  describe('@LoadFromDir', function () {

    let GQL;
    const schemaDir = path.resolve(__dirname, '../../../support/test-schema-dir');

    beforeEach(function () {
      GQL = new GraysQL({ DB });
      GQL.use(LoadFromDir);
    });

    describe('#load(directory, [overwrite])', function () {
      it('should load the schema from the directory', function () {
        GQL.load(schemaDir);
        const result = GraphQLUtils.printSchema(GQL.generateSchema());
        const expected = GraphQLUtils.printSchema(TestSchema.Schema);
        expect(result).to.equal(expected);
      });
      it('should not overwrite by default the registered objects in GraysQL', function () {
        GQL.registerType(TestUser);
        expect(GQL.load.bind(GQL, schemaDir)).to.throw(Error, /GraysQL Error: Type/);
      });
      it('should overwrite the registered objects in GraysQL if specified', function () {
        GQL.registerType(TestUser);
        expect(GQL.load.bind(GQL, schemaDir, true)).to.not.throw(Error, /GraysQL Error: Type/);
      });
    });
  });

}
