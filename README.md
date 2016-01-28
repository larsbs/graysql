# GraysQL #

> NOTE: This is a work in progress.

GraysQL is a manager and loader for [GraphQL](http://graphql.org). It provides a uniform way of
organize your GraphQL schema. GraphQL tries to create an easy to read codebase. It features a
plugins API to allow the extension of the core functionalities.

It's directly compatible with the [GraphQL](http://github.com/graphql/graphql-js) reference
implementation.


## Installation ##

Install from NPM. You need to install it's peer dependencies if you haven't done yet too.

```bash
$ npm install --save graysql graphql graphql-relay
```


## Examples ##

Here is a simple example to get started:

```javascript
const GraphQLUtils = require('graphql/utilities');
const GraysQL = require('graysql');
const Graylay = require('graysql/extensions/graylay');  // Add support for Relay entities
const DB = require('./db');  // Mockup data source

const GQL = new GraysQL({
  DB: DB
});

// Add some extensions
GQL.use(Graylay);

// You can import types
GQL.registerType(require('./types/group'));

// Or define them inline
GQL.registerType(function (GQL, types) {
  return {
    name: 'User',
    nodeId: id => GQL.options.DB.getUser(id),
    isTypeOf: obj => obj instanceof GQL.options.DB.User,
    interfaces: ['Node'],
    fields: {
      id: {
        type: 'Int'
      },
      nick: {
        type: 'String'
      },
      group: {
        type: 'Group'  // Define type dependencies
      }
    },
    queries: {
      user: {  // You can define inline queries
        type: 'User',
        args: {
          id: {
            type: 'Int'
          }
        },
        resolve: (_, args) => GQL.options.DB.getUser(args.id);
      },
      users: require('./queries/users')  // Or import them
    }
  }
});


const Schema = GQL.generateSchema();
console.log(GraphQLUtils.printSchema(Schema));
```


## Overview ##

### Type ###

A [Type](lib/graysql/type.js) is a representation of a
[GraphQLObjectType](http://graphql.org/docs/api-reference-type-system/#graphqlobjecttype). Types are
the main object in GraysQL and every other object relates to them in some way. They define the
layout of your schema. To create a new Type simply create a JavaScript function that takes an
argument that is a reference to the current GraysQL instance and that function should return an
object with the keys needed to create an object.

The mandatory keys are:

  * `name`: A string representing the name of the type that will be used to create and store it.
    Other types will use this name to reference the type as well.
  * `fields`: An object representing the fields of the type. This is directly related to the
    `fields` property in GraphQLObjectType.

The type of the field is specified as a string instead of a [GraphQLScalarType]().  The basic list
of supported types is:

  * `Int`: Translates to
    [GraphQLInt](http://graphql.org/docs/api-reference-type-system/#graphqlint)
  * `String`: Translates to
    [GraphQLString](http://graphql.org/docs/api-reference-type-system/#graphqlstring)
  * `TypeName`: Reference another type in the system.
  * `[TypeName]`: Reference an array of another type in the system. Equivalent to
    [GraphQLList](http://graphql.org/docs/api-reference-type-system/#graphqllist).

Besides that, [extensions](https://github.com/larsbs/graysql#extensions) can define custom keys or
even you can define your own keys if you need it.

#### Example Types ####

Types can be defined in its own file. For example, `types/user.js` and `types/group.js`.

```javascript

// types/user.js
module.exports = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      group: { type: 'String' }
    }
  };
}

// types/group.js
module.exports = function (GQL) {
  return {
    name: 'Group',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      members: { type: '[User]' }
    }
  };
}
```

When the two types are defined, we can register them within the system:

```javascript
const GraysQL = require('graysql');

const GQL = new GraysQL();
GQL.registerType(require('./types/user.js'));
GQL.registerType(require('./types/group.js'));
```

### Interfaces ###
TODO

### Query ###

In order to make request to the
[Schema](http://graphql.org/docs/api-reference-type-system/#graphqlschema) you must define Queries
in your [Types](https://github.com/larsbs/graysql#type). As queries are only plain Javascript
object, they can be defined inline in your types or in separate files and later exported. However,
if you define your queries in standalone files, you should wrap them in a function.  This function,
like types, will receive a single parameter that is the current GQL intance, and should return the
query object.

Once a query is defined, you can add it to the sytem using two ways. Embedding them in a type, like
the first example, or using the auxiliar function `GQL.addQuery(query)`.

The query object should have three keys that are mandatory:

  * `type`: The type to which the query is applied. It has to be registered in the system before the
    query will be generated.
  * `args`: It's equivalent to `args` in
  [GraphQL queries](http://graphql.org/docs/getting-started/#server). It uses the same syntax for
  types than the key `fields` in [Types](https://github.com/larsbs/graysql#type).
  * `resolve`: It's the same as `resolve` in
  [GraphQL queries](http://graphql.org/docs/getting-started/#server).

#### Example Queries ####

```javascript
// queries/user.js
module.exports = function (GQL) {
  return {
    type: 'User',
    args: {
      id: { type: 'Int' }
    },
    resolve: (_, args) => GQL.options.DB.getUser(args.id)
  }
}

// index.js
GQL.addQuery('user', require('./queries/user'));
```

### Mutations ###
TODO

## GraysQL ##

### Constructor ###

#### `new GraysQL(options)` ####
> GraysQL is initialized by passing an object with any number of custom keys. This keys will be
> available later in the GraysQL instance.

```javascript
const DB = require('./db');
const GraysQL = require('graysql');
const GQL = new GraysQL({
  DB: DB
});
console.log(GQL.options.DB);
```

### Methods ###

#### `GraysQL.use(extension)` ####
> Receives a GraysQL extension and add it to GraysQL.

  * **Parameters**
    * `extension` *Function*: A valid [extension]() to be added.

```javascript
const GraysQL = require('graysql');
const LoadFromDir = require('graysql/extensions/load-from-dir');
const Graylay = require('graysql/extensions/graylay');

const GQL = new GraysQL();
GQL.use(LoadFromDir);
GQL.use(Graylay);
```

#### `GQL.registerType(type, [overwrite])` ####
> Registers a new type in the system.

  * **Parameters**
    * `type` *Function*: A valid [type](https://github.com/larsbs/graysql#type) to be registered.
    * `overwrite` *Boolean*: A flag wether the registered type should overwrite an existent type
      with the same name or not.
  * **Returns**
    * *Object*: The registered type.

```javascript
const GraysQL = require('graysql');
const GQL = new GraysQL();

const UserType = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' }
    }
  };
}

GQL.registerType(UserType);
```

#### `GQL.registerInterface(interface, [overwrite])` ####
> Registers a new interface in the system that can be later implemented by types. Interfaces should
> be registered before the implementing types.

  * **Parameters**
    * `interface` *Function*: A valid [interface](https://github.com/larsbs/graysql#interface) to be
      registered.
    * `overwrite` *Boolean*: A flag wether the registered interface should overwrite an existent
      interface with the same name or not.
  * **Returns**
    * *Object*: The registered interface.

```javascript
const GraysQL = require('graysql');
const GQL = new GraysQL();

const EmployeeInterface = function (GQL) {
  return {
    name: 'Employee',
    fields: {
      employeeId: { type: 'Int' }
    }
  };
}
GQL.registerInterface(EmployeeInterface);
```

#### `GQL.addQuery(name, query, [overwrite])` ####
> Adds a new query to the system. Note that if the type of the query is not already registered in
> the system, this will throw an error.

  * **Parameters**
    * `name` *String*: The name of the query to be added.
    * `query` *Function*: A valid [query](https://github.com/larsbs/graysql#query) to be added.
    * `overwrite` *Boolean*: A flag wether the added query should overwrite an existent query with
      the same name or not.
  * **Returns**
    * *Object*: The added query.

#### `GQL.addMutation(name, mutation, [overwrite])` ####
> Adds a new mutation to the system. Note that if the type of the mutation is not already registered
> in the system, this will throw an error.

  * **Parameters**
    * `name` *String*: The name of the mutation to be added.
    * `mutation` *Function*: A valid [mutation](https://github.com/larsbs/graysql#mutation) to be
      added.
    * `overwrite` *Boolean*: A flag wether the added mutation should overwrite an existent mutation
      with the same name or not.
  * **Returns**
    * *Object*: The added mutation.

#### `GQL.generateSchema()` ####
> Generates a [GraphQLSchema](http://graphql.org/docs/api-reference-type-system/#graphqlschema) from
> the registered objects.

  * **Returns**
    * *GraphQLSchema*: The generated schema.

## Extensions ##

### [ORMLoader](https://github.com/larsbs/graysql-orm-loader) ###

Loads the models defined with an ORM into GraysQL to generate a Schema from them. More in the
project [repository](https://github.com/larsbs/graysql-orm-loader).

### LoadFromDir ###

Allows GraysQL to scan a folder to build a schema from the files found. You only need to define your
schema and GraysQL will take care of the registration process for you. This way, you can model your
schema from the dir structure. This allows you to add or delete objects on the fly, without having
to register the new ones, or de-register the old ones

The folder structure that LoadFromDir will search for it's:

```plain
schema/
├── types/
│   ├── type-name/
│   │   └── index.js
├── interfaces/
│   └── interface-name.js
```

Where:
  * **schema/**: Is the root folder of the Schema. It contains all the structure.
  * **types/**: Contains all the defined types. Each type goes in its own folder.
  * **type-name/**: Contains a type. The type is defined in the `index.js` file.
  * **interfaces/**: Contains the interfaces. Each interface goes in it's own file
    `interface-name.js`.

In order for the queries to be automatically added to GraysQL, each type should define its queries
in its own `query` key.

LoadFromDir defines a new method in GraysQL:

#### `GQL.load(directory, [overwrite])` ####
> Load the objects from the given folder and add them to GraysQL.

  * **Parameters**
    * `directory` *String*: The root folder that contains the objects.
    * `Overwrite` *Boolean*: A flag wether the loaded objects should overwrite existent objects with
      the same name or not.

```javascript
// schema/types/user.js
module.exports = function (GQL) {
  return {
    name: 'User',
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' }
    },
    queries: {
      user: {
        type: 'User',
        args: { id: { type: 'Id' } },
        resolve: (_, args) => GQL.options.DB.getUser(args.id)
      }
    }
  };
}

// index.js
const DB = require('./db');
const GraysQL = require('graysql');
const LoadFromDir = require('graysql/extensions/load-from-dir');

const GQL = new GraysQL({ DB: DB });
GQL.use(LoadFromDir);
GQL.load('schema');
```

### Graylay ###

Creates Relay compatible objects from your objects. Add needed entities for
[Relay](https://facebook.github.io/relay/) to work with your Schema. For instance, it creates the
Node interface or establishes connections between your types. Besides to the common keys your type
need to define, Graylay adds one more, `nodeId`. Graylay will use this key to generate the
[Node](https://github.com/graphql/graphql-relay-js#object-identification) interface needed by Relay.

Additionaly, Graylay adds two new symbols to define relations between types. If you precede a type
name with `@` Graylay will translate that into a
[connection](https://github.com/graphql/graphql-relay-js#connections) with that type and will
resolve to a [connectionFromArray](https://github.com/graphql/graphql-relay-js#connections). If you
precede a type name with `@>` instead, Graylay will translate that into a connection that will
resolve to a [connectionFromPromisedArray](https://github.com/graphql/graphql-relay-js#connections).
In any case, you can specify your own resolve, and Graylay will honour it. Besides that, your types
will need to define the usual `keys` needed by Relay like `isTypeOf` and implement the Node
interface.

```javascript
const GraysQL = require('graysql');
const DB = require('./db');
const GraphQLRelay = require('graphql-relay');
const Graylay = require('graysql/extensions/graylay');

const UserType = function (GQL) {
  return {
    name: 'User',
    nodeId: id => GQL.options.DB.getUser(id),
    isTypeOf: obj => obj instanceof GQL.options.DB.User,
    interfaces: ['Node'],
    fields: {
      id: { type: 'Int' },
      nick: { type: 'String' },
      groups: {
        type: '@Group'  // Resolves to a connectionFromArray
      }
    }
  };
}

const GQL = new GraysQL({ DB: DB });
GQL.use(Graylay);
GQL.registerType(UserType);
```

### Plugin API ###

TODO

## Examples ##

Usage examples can be found in [examples](examples) directory.

## Tests ##

The tests are written with [mocha](https://mochajs.org/) and can be run with the following command:

```bash
$ npm test
```

To get a code coverage report, run the following command:

```bash
$ npm run cover
```

## TODO ##

- [x] Add support for non nullable args in mutations and queries.
- [x] Implement Graylay and LoadFromDir.
- [ ] Document Plugin API.
- [ ] Provide an async version of LoadFromDir.

## License ##

[MIT](LICENSE)
