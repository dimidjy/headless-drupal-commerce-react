/**
 * Debug utility for GraphQL requests
 * This file provides functions to debug GraphQL requests and responses
 */

// Debug a GraphQL operation before it's sent
export const debugGraphQLOperation = (operation, variables) => {
  console.group('=== GraphQL Operation Debug ===');
  console.log('Operation Name:', operation?.definitions?.[0]?.name?.value || 'Unnamed Operation');
  console.log('Operation Type:', operation?.definitions?.[0]?.operation || 'Unknown');
  console.log('Query:', operation?.loc?.source?.body || 'No query available');
  console.log('Variables:', JSON.stringify(variables, null, 2));
  console.groupEnd();
};

// Debug a GraphQL response
export const debugGraphQLResponse = (data, operation) => {
  console.group('=== GraphQL Response Debug ===');
  console.log('Operation Name:', operation?.definitions?.[0]?.name?.value || 'Unnamed Operation');
  console.log('Data:', data);
  console.groupEnd();
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
  console.group('=== Fetch Debug ===');
  console.log('URL:', url);
  console.log('Method:', options.method);
  console.log('Headers:', options.headers);
  
  if (options.body) {
    try {
      const body = JSON.parse(options.body);
      console.log('Body:', body);
    } catch (e) {
      console.log('Body (raw):', options.body);
    }
  }
  console.groupEnd();
  
  // Return a function to debug the response
  return (response) => {
    console.group('=== Fetch Response Debug ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.groupEnd();
    
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
  debugFetch(url, options);
  
  return fetch(url, options)
    .then(response => {
      console.group('=== Fetch Response Debug ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries([...response.headers.entries()]));
      
      // Clone the response to read the body
      const clonedResponse = response.clone();
      
      clonedResponse.text().then(text => {
        if (isHtmlResponse(text)) {
          console.error('ERROR: Received HTML instead of JSON');
          console.error('HTML Response (first 500 chars):', text.substring(0, 500));
        } else {
          try {
            const json = JSON.parse(text);
            console.log('Response Body:', json);
          } catch (e) {
            console.log('Response is not valid JSON');
            console.log('Response Text (first 500 chars):', text.substring(0, 500));
          }
        }
      });
      
      console.groupEnd();
      return response;
    })
    .catch(error => {
      console.group('=== Fetch Error Debug ===');
      console.error('Error:', error);
      console.groupEnd();
      throw error;
    });
}; 