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

// Checkout Fragments
export const CHECKOUT_FRAGMENT = gql`
  fragment CheckoutFields on CommerceOrder {
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
      }
    }
    billingProfile {
      id
      address {
        addressLine1
        addressLine2
        locality
        administrativeArea
        postalCode
        countryCode
        givenName
        familyName
      }
    }
    shippingInformation {
      address {
        addressLine1
        addressLine2
        locality
        administrativeArea
        postalCode
        countryCode
        givenName
        familyName
      }
      shippingMethod {
        id
        label
        amount {
          number
          currencyCode
          formatted
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

// Cart Mutations
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

// Checkout Mutations
export const UPDATE_SHIPPING_INFO = gql`
  mutation UpdateShippingInfo(
    $orderId: ID!,
    $firstName: String!,
    $lastName: String!,
    $address1: String!,
    $address2: String,
    $city: String!,
    $state: String!,
    $postalCode: String!,
    $country: String!,
    $email: String!,
    $phone: String!
  ) {
    updateShippingInfo(
      orderId: $orderId,
      shippingAddress: {
        givenName: $firstName
        familyName: $lastName
        addressLine1: $address1
        addressLine2: $address2
        locality: $city
        administrativeArea: $state
        postalCode: $postalCode
        countryCode: $country
      },
      email: $email,
      phone: $phone
    ) {
      order {
        ...CheckoutFields
      }
      errors
    }
  }
  ${CHECKOUT_FRAGMENT}
`;

export const UPDATE_BILLING_INFO = gql`
  mutation UpdateBillingInfo(
    $orderId: ID!,
    $firstName: String!,
    $lastName: String!,
    $address1: String!,
    $address2: String,
    $city: String!,
    $state: String!,
    $postalCode: String!,
    $country: String!
  ) {
    updateBillingInfo(
      orderId: $orderId,
      billingAddress: {
        givenName: $firstName
        familyName: $lastName
        addressLine1: $address1
        addressLine2: $address2
        locality: $city
        administrativeArea: $state
        postalCode: $postalCode
        countryCode: $country
      }
    ) {
      order {
        ...CheckoutFields
      }
      errors
    }
  }
  ${CHECKOUT_FRAGMENT}
`;

export const UPDATE_SHIPPING_METHOD = gql`
  mutation UpdateShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
    updateShippingMethod(
      orderId: $orderId,
      shippingMethodId: $shippingMethodId
    ) {
      order {
        ...CheckoutFields
      }
      errors
    }
  }
  ${CHECKOUT_FRAGMENT}
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($orderId: ID!, $paymentMethod: String!, $paymentDetails: PaymentDetailsInput) {
    placeOrder(
      orderId: $orderId,
      paymentMethod: $paymentMethod,
      paymentDetails: $paymentDetails
    ) {
      orderId
      orderNumber
      complete
      errors
    }
  }
`; 