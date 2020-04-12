const { makeExecutableSchema } = require("graphql-tools");
const md5 = require("md5");
const { data } = require("../data");
const { gql } = require("apollo-server-express");

const numberExtraTypes = Number.parseInt(process.env.NUM_EXTRA_TYPES, 10) || 0
const extraTypes = Array(numberExtraTypes).fill(null).map((_, index) => {
  const fields = Array(25).fill(null).map((_, index) => {
    const char = String.fromCharCode(index + 65)
    const fieldName = Array(25).fill(char).join('')
    return `    ${fieldName}: String`
  }).join('\n')
  return `  type ExtraType${index + 1} { \n${fields} \n  }`
}).join('\n\n')

const typeDefs = gql`
  ${extraTypes}

  type Author {
    id: ID!
    name: String!
    md5: String!
    company: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    name: String!
    numPages: Int!
  }

  type Query {
    authors: [Author!]!
  }
`;

const resolvers = {
  Author: {
    md5: parent => md5(parent.name)
  },
  Query: {
    authors: () => {
      return data;
    }
  }
};

const asyncResolvers = {
  Author: {
    md5: parent => md5(parent.name)
  },
  Query: {
    authors: async () => {
      return data;
    }
  }
};

module.exports.createApolloSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers
  });
};

module.exports.createAsyncApolloSchema = () => {
  return makeExecutableSchema({
    typeDefs,
    resolvers: asyncResolvers
  });
};
