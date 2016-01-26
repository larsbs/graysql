'use strict';

const graphql = require('graphql');

const Type = require('./graysql/type');
const Query = require('./graysql/query');
const Mutation = require('./graysql/mutation');
const Interface = require('./graysql/interface');


class GraysQL {

  constructor(options) {
    if (options && typeof options !== 'object') {
      throw new TypeError(`GraysQL Error: Expected options to be an object, got ${typeof options} instead`);
    }

    // Initialize private state
    this._listeners = {
      onParseTypeField: [],
      onGenerateType: [],
      onParseInterfaceField: [],
      onGenerateInterface: [],
      onParseQueryArg: [],
      onGenerateQueryArg: [],
      onParseMutationArg: [],
      onGenerateMutationArg: []
    };
    this._types = {};
    this._finalTypes = {};
    this._interfaces = {};
    this._finalInterfaces = {};
    this._queries = {};
    this._mutations = {};

    // Initialize public state
    this.options = Object.assign({}, options);
  }

  use(extension) {
    if (typeof extension !== 'function') {
      throw new TypeError(`GraysQL Error: Expected extension to be a function, got ${typeof extension} instead`);
    }

    extension = extension(GraysQL);

    // Call onInit method of extension
    if (extension.onInit) {
      extension.onInit.bind(this)();
      delete extension.onInit;
    }

    // Mount the extension
    for (const key in extension) {
      if ( ! this._listeners[key] && ! key.startsWith('_')) {
        GraysQL.prototype[key] = extension[key];
      }
      else if (this._listeners[key]) {
        this._listeners[key].push(extension[key].bind(this));
      }
    }
  }

  registerType(type, overwrite) {
    if (type instanceof graphql.GraphQLObjectType) {
      return this._finalTypes[type.name] = type;
    }

    if (typeof type !== 'function') {
      throw new TypeError(`GraysQL Error: Expected type to be a function, got ${typeof type} instead`);
    }

    const typeObj = type(this);

    if (this._types[typeObj.name] && ! overwrite) {
      throw new Error(`GraysQL Error: Type ${typeObj.name} is already registered`);
    }

    // Add type queries
    for (const queryName in typeObj.queries) {
      let query;
      if (typeof typeObj.queries[queryName] === 'function') {
        query = typeObj.queries[queryName];
      }
      else {
        query = () => typeObj.queries[queryName];
      }
      this.addQuery(queryName, query, overwrite);
    }
    // Add type mutations
    for (const mutationName in typeObj.mutations) {
      let mutation;
      if (typeof typeObj.mutations[mutationName] === 'function') {
        mutation = typeObj.mutations[mutationName];
      }
      else {
        mutation = () => typeObj.mutations[mutationName];
      }
      this.addMutation(mutationName, mutation, overwrite);
    }

    this._types[typeObj.name] = new Type(typeObj, {
      onParseTypeField: this._listeners.onParseTypeField,
      onGenerateType: this._listeners.onGenerateType
    });

    return typeObj;
  }

  registerInterface(iface, overwrite) {
    if (iface instanceof graphql.GraphQLInterfaceType) {
      return this._finalInterfaces[iface.name] = iface;
    }

    if (typeof iface !== 'function') {
      throw new TypeError(`GraysQL Error: Expected interface to be a function, got ${typeof type} instead`);
    }

    const ifaceObj = iface(this);

    if (this._interfaces[ifaceObj.name] && ! overwrite) {
      throw new Error(`GraysQL Error: Interface ${ifaceObj.name} is already registered`);
    }

    this._interfaces[ifaceObj.name] = new Interface(ifaceObj, {
      onParseInterfaceField: this._listeners.onParseInterfaceField,
      onGenerateInterface: this._listeners.onGenerateInterface
    });

    return ifaceObj;
  }

  addQuery(name, query, overwrite) {
    if (typeof query !== 'function') {
      throw new TypeError(`GraysQL Error: Expected query to be a function, got ${typeof query} instead`);
    }

    if ( ! name) {
      throw new Error(`GraysQL Error: Missing query name`);
    }

    const queryObj = query(this);

    if (this._queries[name] && ! overwrite) {
      throw new Error(`GraysQL Error: Query ${name} is already added`);
    }

    this._queries[name] = new Query(queryObj, {
      onGenerateQuery: this._listeners.onGenerateQuery,
      onParseQueryArg: this._listeners.onParseQueryArg
    });

    return queryObj;
  }

  addMutation(name, mutation, overwrite) {
    if (typeof mutation !== 'function') {
      throw new TypeError(`GraysQL Error: Expected mutation to be a function, got ${typeof mutation} instead`);
    }

    if ( ! name) {
      throw new Error(`GraysQL Error: Missing mutation name`);
    }

    const mutationObj = mutation(this);

    if (this._mutations[name] && ! overwrite) {
      throw new Error(`GraysQL Error: Mutation ${name} is already added`);
    }

    this._mutations[name] = new Mutation(mutationObj);

    return mutationObj;
  }

  generateSchema() {
    const finalInterfaces = this._generateInterfaces();
    const finalTypes = this._generateTypes(finalInterfaces);
    const Query = this._generateQuery(finalTypes);
    const Mutation = this._generateMutation(finalTypes);

    const schemaDef = {};
    if (Query) {
      schemaDef['query'] = Query;
    }
    if (Mutation) {
      schemaDef['mutation'] = Mutation;
    }

    return new graphql.GraphQLSchema(schemaDef);
  }

  _generateInterfaces() {
    const finalInterfaces = Object.assign(this._finalInterfaces, this._interfaces);
    for (const key in this._interfaces) {
      finalInterfaces[key] = this._interfaces[key].generate({});
    }
    return finalInterfaces;
  }

  _generateTypes(interfaces) {
    const finalTypes = Object.assign(this._finalTypes, this._types);
    for (const key in this._types) {
      finalTypes[key] = this._types[key].generate(finalTypes, interfaces);
    }
    return finalTypes;
  }

  _generateQuery(finalTypes) {
    const finalQueries = {};
    for (const key in this._queries) {
      finalQueries[key] = this._queries[key].generate(finalTypes);
    }
    return Object.keys(finalQueries).length > 0 ? new graphql.GraphQLObjectType({
      name: 'Query',
      fields: finalQueries
    }) : null;
  }

  _generateMutation(finalTypes) {
    const finalMutations = {};
    for (const key in this._mutations) {
      finalMutations[key] = this._mutations[key].generate(finalTypes);
    }
    return Object.keys(finalMutations).length > 0 ? new graphql.GraphQLObjectType({
      name: 'Mutation',
      fields: finalMutations
    }) : null;
  }

}


module.exports = GraysQL;
