import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Create an HTTP link to the Drupal GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://chic-nest.lndo.site/api/graphql',
  credentials: 'include', // Include cookies for session authentication
});

// Create the Apollo Client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 