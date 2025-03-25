/**
 * Debug utility for GraphQL requests
 * This file provides functions to debug GraphQL requests and responses
 */

// Debug a GraphQL operation before it's sent
export const debugGraphQLOperation = (operation, variables) => {
  // Debug operation removed
};

// Debug a GraphQL response
export const debugGraphQLResponse = (data, operation) => {
  // Debug response removed
};

// Debug a GraphQL error
export const debugGraphQLError = (error, operation, variables) => {
  console.group('=== GraphQL Error Debug ===');
  console.error('Error Message:', error.message);
  
  if (error.graphQLErrors) {
    console.error('GraphQL Errors:', error.graphQLErrors);
  }
  
  if (error.networkError) {
    console.error('Network Error:', error.networkError);
    
    if (error.networkError.result) {
      console.error('Error Result:', error.networkError.result);
    }
    
    if (error.networkError.bodyText) {
      console.error('Error Body Text:', error.networkError.bodyText.substring(0, 500));
    }
  }
  
  console.error('Operation Name:', operation?.definitions?.[0]?.name?.value || 'Unnamed Operation');
  console.error('Operation Type:', operation?.definitions?.[0]?.operation || 'Unknown');
  console.error('Query:', operation?.loc?.source?.body || 'No query available');
  console.error('Variables:', JSON.stringify(variables, null, 2));
  console.groupEnd();
};

// Debug the fetch request
export const debugFetch = (url, options) => {
  // Debug fetch request removed
  
  // Return a function to debug the response
  return (response) => {
    // Debug response removed
    return response;
  };
};

// Utility to check if a response is HTML instead of JSON
export const isHtmlResponse = (text) => {
  return text.includes('<!DOCTYPE html>') || 
         text.includes('<!-- THEME') || 
         text.includes('<html') || 
         text.includes('<body');
};

// Export a wrapped fetch function for debugging
export const debugWrappedFetch = (url, options) => {  
  return fetch(url, options)
    .then(response => {
      // Clone the response to read the body
      const clonedResponse = response.clone();
      
      clonedResponse.text().then(text => {
        if (isHtmlResponse(text)) {
          console.error('ERROR: Received HTML instead of JSON');
          console.error('HTML Response (first 500 chars):', text.substring(0, 500));
        }
      });
      
      return response;
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      throw error;
    });
}; 