'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');

const DB = require('../../../../support/db');
const TestUser = require('../../../../support/test-schema-dir/relay-types/user');
const TestGroup = require('../../../../support/test-schema-dir/relay-types/group');
const TestSchemaRelay = require('../../../../support/test-schema-relay');


module.exports = function (GraysQL, Graylay) {

  describe('@Graylay', function () {

    let GQL;
    let Schema;

    before(function () {
      GQL = new GraysQL({ DB });
      GQL.use(Graylay);
      GQL.registerType(TestGroup);
      GQL.registerType(TestUser);
      Schema = GQL.generateSchema();
    });

    it('should generate a Relay schema', function () {
      const result = GraphQLUtils.printSchema(Schema);
      const expected = GraphQLUtils.printSchema(TestSchemaRelay.Schema);
      expect(result).to.equal(expected);
    });

    it('should generate a valid Relay schema', function (done) {
      const query = `query GetGroup {
        group(id: 1) {
          id,
          name,
          members {
            edges {
              node {
                id,
                nick
              }
            }
          }
        }
      }`;
      const expected = {
        "data": {
          "group": {
            "id": "R3JvdXA6MQ==",
            "name": "Group 1",
            "members": {
              "edges": [
                {
                  "node": {
                    "id": "VXNlcjox",
                    "nick": "Lars"
                  }
                },
                {
                  "node": {
                    "id": "VXNlcjoy",
                    "nick": "Deathvoid"
                  }
                }
              ]
            }
          }
        }
      }
      graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
    });

  });

};
