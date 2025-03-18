# React + Drupal Commerce Integration

This React application integrates with Drupal 10 and Commerce 2 to provide a complete e-commerce experience. It uses GraphQL for seamless data exchange between the frontend and backend.

## Features

- Product browsing and search
- Shopping cart functionality
  - Add/remove items
  - Update quantities
- Complete checkout process
  - Shipping information
  - Billing information
  - Payment processing
  - Order review
- Responsive design for all devices

## Prerequisites

- Node.js 16+ and npm
- Drupal 10 with the following modules:
  - Commerce 2.x
  - Commerce API
  - Commerce Cart API
  - GraphQL Compose Commerce

## Setup

1. Clone the repository:
```
git clone <repository-url>
cd react-app
```

2. Install dependencies:
```
npm install
```

3. Configure the proxy in `setupProxy.js` to point to your Drupal instance if needed

4. Start the development server:
```
npm start
```

## GraphQL Integration

This application uses Apollo Client to communicate with Drupal's GraphQL API. The GraphQL queries and mutations are defined in `src/graphql/queries.js`.

### Available GraphQL Operations

#### Queries:
- `GET_PRODUCTS` - Fetch a list of products
- `GET_PRODUCT` - Fetch a single product by ID 
- `GET_CART` - Fetch the current user's cart

#### Mutations:
- `ADD_TO_CART` - Add a product to the cart
- `UPDATE_CART_ITEM` - Update the quantity of a cart item
- `REMOVE_CART_ITEM` - Remove an item from the cart
- `UPDATE_SHIPPING_INFO` - Update shipping information during checkout
- `UPDATE_BILLING_INFO` - Update billing information during checkout
- `UPDATE_SHIPPING_METHOD` - Update the selected shipping method
- `PLACE_ORDER` - Complete the order with payment information

## Folder Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/pages/custom/` - Custom page implementations
- `src/routes/` - Application routing
- `src/graphql/` - GraphQL queries and mutations
- `src/utils/` - Utility functions and helpers

## Drupal Configuration

On your Drupal site, ensure the following:

1. Commerce product types and variations are set up
2. Payment gateways are configured
3. Shipping methods are defined
4. GraphQL schema is exposed correctly with all necessary fields

## Development

### Adding New Pages

1. Create a new page component in `src/pages/custom/`
2. Export it from `src/pages/custom/index.js`
3. Add a route in `src/routes/AppRoutes.js`

### Extending GraphQL Operations

1. Define new fragments, queries, or mutations in `src/graphql/queries.js`
2. Use them in your components with Apollo's `useQuery` and `useMutation` hooks

## License

This project is licensed under the MIT License - see the LICENSE file for details. 