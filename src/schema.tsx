import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';

const typeDefs = `
  type BranchA {
    a: String!
  }

  type BranchB {
    b: String!
  }

  union UnionExample = BranchA | BranchB

  type Query {
    values: [UnionExample!]!
  }
`;

export const schema = addMocksToSchema({
	schema: makeExecutableSchema({ typeDefs }),
});
