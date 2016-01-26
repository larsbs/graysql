'use strict';

const path = require('path');
const express = require('express');
const GraphQLUtils = require('graphql/utilities');
const GraphQLHTTP = require('express-graphql');
const GraysQL = require('graysql');
const LoadFromDir = require('graysql/extensions/load-from-dir');

const DB = require('./db');


const DEFAULT_PORT = 3000;
const SCHEMA_PATH = path.join(__dirname, 'schema');


const app = express();
const GQL = new GraysQL({ DB });


GQL.use(LoadFromDir);


GQL.load(SCHEMA_PATH);
const Schema = GQL.generateSchema();


app.set('port', (process.env.port || DEFAULT_PORT));


app.use('/graphql', GraphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));


app.listen(app.get('port'), () => {
  console.log(`Server started at: http://localhost:${app.get('port')}/`);
  console.log('Using schema: ');
  console.log(GraphQLUtils.printSchema(Schema))
});


