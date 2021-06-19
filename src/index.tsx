/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import schema from './schema';
import { PageQuery } from './generated/graphql'

const link = new ApolloLink((operation) => {
  // @ts-ignore
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
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
  query Page {
    ...String
    ...Number
  }

  fragment String on Query {
    items {
      string
    }
  }

  fragment Number on Query {
    items {
      number
    }
  }
`;

function App() {
  const { loading, data } = useQuery<PageQuery>(RECURSIVE);
  if (loading || !data) return <>loading...</>;

  // item.number can't be accessed in TS, but it actually exists in the data
  const mapped = data.items.map(item => [item.number, item.string]);

  return <pre>{JSON.stringify({ mapped }, null, 2)}</pre>;
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
