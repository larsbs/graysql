# GraysQL #

GraysQL is a manager and loader for [GraphQL](http://graphql.org). It provides
a uniform way of organize your GraphQL schema. GraphQL tries to create an easy
to read codebase. It features a plugins API to allow the extension of the core
functionalities.

It's directly compatible with the [GraphQL](http://github.com/graphql/graphql-js)
reference implementation.


## Installation ##

Install from NPM. You need to install it's peer dependencies if you haven't
done yet too.

```bash
$ npm install --save graysql graphql graphql-relay
```


## Examples ##

Here is a simple example to get started:

```javascript
const GraphQLUtils = require('graphql/utilities');
const GraysQL = require('graysql');  // Add support for Relay entities
const DB = require('./db');  // Mockup data source

// Add some extensions
GraysQL.use(Graylay);

const GQL = new GraysQL({
  DB: DB
});

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

A [Type]() is a representation of a [GraphQLObjectType](). Types are the main
object in GraysQL and every other object relates to them in some way. They
define the layout of your schema. To create a new Type simple create a
JavaScript function that takes an argument that is a reference to the current
GraysQL instance and that function should return an object with the keys
needed to create an object.

The mandatory keys are:

 * `name`: A string representing the name of the type that will be used to
 create and store it. Other types will use this name to reference the type
 as well.
 * `fields`: An object representing the fields of the type. This is directly
 related to the `fields` property in [GraphQLObjectType]().

The type of the field is specified as a string instead of a [GraphQLScalarType]().
The basic list of supported types is:
   * `Int`: Translates to [GraphQLInt]()
   * `String`: Translates to [GraphQLString]()
   * `TypeName`: Reference another type in the system.
   * `[TypeName]`: Reference an array of another type in the system. Equivalent
   to [GraphQLList]().

Besides that, [plugins]() can define custom keys or even you can define your own
keys if you need it.

#### Example Types ####

Types can be defined in it's own file. For example, `types/user.js` and
`types/group.js`.

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

In order to make request to the [Schema]() you must define [Queries]() in your
[Types](). As queries are only plain Javascript object, they can be defined
inline in your types or in separate files and later exported. However, if you
define your queries in standalone files, you should wrap them in a function.
This function, like types, will receive a single parameter that it's the
current GQL intance, and should return the query object.

Once a query is defined, you can add it to the sytem using two ways. Embedding
them in a type, like the first example, or using the auxiliar
function `GQL.addQuery(query)`.

The query object should have three keys that are mandatory:

 * `type`: The type to which the query is applied. It has to be registered in
 the system before the query is added.
 * `args`: It's equivalent to `args` in [GraphQL queries](). Uses the same
 syntax for types than the key `fields` in [Types]().
 * `resolve`: It's the same as `resolve` in [GraphQL queries]().

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
> GraysQL is initialized by passing an object with any number of custom keys. This
> keys will be available later in the GraysQL instance.

```javascript
const DB = require('./db');
const GraysQL = require('graysql');
const GQL = new GraysQL({
  DB: DB
});
console.log(GQL.options.DB);
```

### Static ###

#### `GraysQL.use(extension)` ####
> Receives a GraysQL extension and add it to GraysQL.
  * **Parameters**
    * `extension` *Function*: A valid [extension]() to be added.

```javascript
const GraysQL = require('graysql');
const LoadFromDir = require('graysql/extensions/load-from-dir');
const Graylay = require('graysql/extensions/graylay');

GraysQL.use(LoadFromDir);
GraysQL.use(Graylay);
```

### Methods ###

#### `GQL.registerType(type, [overwrite])` ####
> Registers a new type in the system.
  * **Parameters**
    * `type` *Function*: A valid [type]() to be registered.
    * `overwrite` *Boolean*: A flag wether the registered type should overwrite
    an existent type with the same name or not.
  * **Returns**
    * *Function*: The registered type.

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
> Registers a new interface in the system that can be later implemented by types. Interfaces should be registered
> before the implementing types.
  * **Parameters**
    * `interface` *Function*: A valid [interface]() to be registered.
    * `overwrite` *Boolean*: A flag wether the registered interface should overwrite
    an existent interface with the same name or not.
  * **Returns**
    * *Function*: The registered interface.

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
> Adds a new query to the system. Note that if the type of the query is not already registered in the
> system, this will throw an error.
  * **Parameters**
    * `name` *String*: The name of the query to be added.
    * `query` *Function*: A valid [query]() to be added.
    * `overwrite` *Boolean*: A flag wether the registered query should overwrite
    an existent query with the same name or not.
  * **Returns**
    * *Function*: The added query.

## Plugins ##

### LoadFromDir ###
### Graylay ###

### Plugin API ###

## Examples ##
## Tests ##
