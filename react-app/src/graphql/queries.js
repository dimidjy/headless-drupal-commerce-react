import { gql } from '@apollo/client';

// Product Fragments
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on CommerceProduct {
    id
    title
    body {
      value
      format
      processed
      summary
    }
    images {
      url
      alt
      variations(styles: MEDIUM) {
        url
      }
    }
    price {
      number
      currencyCode
      formatted
    }
    product_image {
      url
      alt
      variations(styles: MEDIUM) {
        url
      }
    }
    url
    variations {
      id
      sku
      title
      price {
        number
        currencyCode
        formatted
      }
      attributes {
        attribute
        value
      }
      images {
        url
        alt
        variations(styles: MEDIUM) {
          url
        }
      }
    }
  }
`;

// Cart Fragments
export const CART_FRAGMENT = gql`
  fragment CartFields on CommerceOrder {
    id
    orderNumber
    state
    total {
      number
      currencyCode
      formatted
    }
    items {
      id
      title
      quantity
      unitPrice {
        number
        currencyCode
        formatted
      }
      totalPrice {
        number
        currencyCode
        formatted
      }
      purchasedEntity {
        id
        sku
        title
        price {
          formatted
        }
        images {
          url
          alt
          variations(styles: THUMBNAIL) {
            url
          }
        }
      }
    }
  }
`;

// Queries
export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int, $filter: EntityQueryFilterInput, $sort: [EntityQuerySortInput!]) {
    products(limit: $limit, offset: $offset, filter: $filter, sort: $sort) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

// Mutations
export const ADD_TO_CART = gql`
  mutation AddToCart($productVariationId: ID!, $quantity: Int) {
    addToCart(productVariationId: $productVariationId, quantity: $quantity) {
      cart {
        ...CartFields
      }
      errors
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($orderItemId: ID!, $quantity: Int!) {
    updateCartItem(orderItemId: $orderItemId, quantity: $quantity) {
      cart {
        ...CartFields
      }
      errors
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($orderItemId: ID!) {
    removeCartItem(orderItemId: $orderItemId) {
      cart {
        ...CartFields
      }
      errors
    }
  }
  ${CART_FRAGMENT}
`; 