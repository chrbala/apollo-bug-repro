const { makeExecutableSchema } = require("@graphql-tools/schema");
const { addMocksToSchema } = require("@graphql-tools/mock");

const typeDefs = `
type Item {
  string: String!
  number: Int!
}

type Query {
  items: [Item!]!
}
`;

module.exports = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs }),
});
