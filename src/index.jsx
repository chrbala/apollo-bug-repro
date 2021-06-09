/*** SCHEMA ***/
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";

const typeDefs = `
type Value {
  item: Item
}

type Container {
  text: String!
  value: Value!
}

type Item {
  id: ID!
  value: Container!
}

type Query {
  item(id: ID!): Item!
}
`;

export const schema = addMocksToSchema({
  schema: makeExecutableSchema({ typeDefs }),
});

/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
function delay(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

const link = new ApolloLink((operation) => {
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
    await delay(300);
    try {
      const result = await graphql(
        schema,
        print(query),
        null,
        null,
        variables,
        operationName
      );
      console.log(result);
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

/*** APP ***/
import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";
import "./index.css";

const RECURSIVE = gql`
  query Query {
    item(id: "123") {
      id
      value {
        ...ContainerFragment
      }
    }
  }

  fragment ContainerFragment on Container {
    value {
      ...ValueFragment
      item {
        id
        value {
          text
        }
      }
    }
  }

  fragment ValueFragment on Value {
    item {
      ...ItemFragment
    }
  }

  fragment ItemFragment on Item {
    value {
      value {
        __typename
      }
    }
  }
`;

function App() {
  const { loading, data } = useQuery(RECURSIVE);

  return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}

const client = new ApolloClient({
  cache: new InMemoryCache({}),
  link,
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
