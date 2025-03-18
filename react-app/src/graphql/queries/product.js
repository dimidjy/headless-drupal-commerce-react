import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch detailed product information
 */
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    commerceProductDefault(id: $id) {
      id
      title
      body {
        value
        processed
        format
        summary
      }
      image {
        id
        mediaImage {
          width
          url
          title
          height
          alt
          variations(styles: MEDIUM) {
            url
          }
        }
      }
    }
  }
`; 