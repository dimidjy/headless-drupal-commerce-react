import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { debugGraphQLError, debugWrappedFetch, isHtmlResponse } from './debugGraphQL';

// Error handling link with detailed logging
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Use our debug utility for errors
  debugGraphQLError(
    { graphQLErrors, networkError, message: networkError?.message || graphQLErrors?.[0]?.message || 'Unknown error' },
    operation.query,
    operation.variables
  );
});

// Add auth headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };
});

// Debug link to log requests before they're sent
const debugLink = setContext((operation, { headers }) => {
  // Return the original context unchanged
  return { headers };
});

// Create an HTTP link to the Drupal GraphQL endpoint
const httpLink = createHttpLink({
  uri: '/api/graphql-default-api', // Use the proxy configured in setupProxy.js
  credentials: 'include', // Include cookies for session authentication
  fetchOptions: {
    mode: 'cors',
    method: 'POST',
  },
  // Force POST for all GraphQL operations
  useGETForQueries: false,
  // Use our custom debug fetch
  fetch: (uri, options) => {
    // Use our debug wrapped fetch
    return debugWrappedFetch(uri, options).then(response => {
      // Check for HTML responses which indicate an error
      const clonedResponse = response.clone();
      return clonedResponse.text().then(text => {
        if (isHtmlResponse(text)) {
          console.error('=== GraphQL HTML Response Error ===');
          console.error('Received HTML instead of JSON. This indicates an authentication or routing issue.');
          console.error('Request URL:', uri);
          console.error('HTML Response (first 500 chars):', text.substring(0, 500));
          
          // Throw a more descriptive error
          throw new Error('Received HTML instead of JSON. This indicates an authentication or routing issue.');
        }
        
        // Return the original response if it's not HTML
        return response;
      });
    });
  }
});

// Create the Apollo Client
const client = new ApolloClient({
  link: from([errorLink, debugLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only', // Don't cache, always make a network request
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only', // Don't cache, always make a network request
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 