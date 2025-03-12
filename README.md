# Decoupled Drupal Commerce with React

This project is a decoupled Drupal 10 Commerce site with a React frontend, connected via GraphQL.

## Backend Setup (Drupal)

### Requirements

- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- Drupal 10

### Installation

1. Clone this repository
2. Run `composer install` to install Drupal and dependencies
3. Install Drupal using the standard installation profile
4. Enable the required modules:
   ```
   drush en -y commerce commerce_product commerce_cart commerce_checkout commerce_payment graphql graphql_compose graphql_compose_extra jsonapi jsonapi_extras cors app_core
   ```
5. Configure CORS in your settings.php file to allow requests from your React frontend
6. Create product types, variations, and other commerce entities as needed

## Frontend Setup (React)

### Requirements

- Node.js 16 or higher
- npm or yarn

### Installation

1. Navigate to the React app directory (to be created)
2. Run `npm install` or `yarn install` to install dependencies
3. Configure the GraphQL endpoint in your React app
4. Run `npm start` or `yarn start` to start the development server

## GraphQL API

The GraphQL API is available at `/api/graphql`. You can explore the API using GraphQL Explorer.

### Example Queries

#### Fetch Products

```graphql
query {
  products(limit: 10) {
    edges {
      node {
        id
        title
        variations {
          id
          sku
          price {
            number
            currencyCode
            formatted
          }
        }
      }
    }
  }
}
```

#### Fetch Cart

```graphql
query {
  cart {
    id
    orderNumber
    items {
      id
      title
      quantity
      totalPrice {
        formatted
      }
    }
    total {
      formatted
    }
  }
}
```

### Example Mutations

#### Add to Cart

```graphql
mutation {
  addToCart(productVariationId: "1", quantity: 1) {
    cart {
      id
      items {
        id
        title
        quantity
      }
    }
    errors
  }
}
```

## Development Workflow

1. Create and configure Commerce entities in Drupal
2. Expose them via GraphQL
3. Consume the GraphQL API in your React frontend
4. Style and enhance the React components

## Deployment

For production deployment:

1. Set up a CI/CD pipeline
2. Configure proper CORS settings
3. Enable caching for GraphQL queries
4. Optimize React build for production

## Additional Resources

- [Drupal Commerce Documentation](https://docs.drupalcommerce.org)
- [GraphQL Module Documentation](https://www.drupal.org/docs/contributed-modules/graphql)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

## Security Vulnerability Fixes

The project had some security vulnerabilities in its dependencies. To fix them:

1. Make the fix script executable:
   ```
   chmod +x fix-vulnerabilities.sh
   ```

2. Run the fix script:
   ```
   ./fix-vulnerabilities.sh
   ```

3. If you need to install the npm-force-resolutions package first:
   ```
   npm install -g npm-force-resolutions
   ```

This approach is safer than using `npm audit fix --force`, which can introduce breaking changes. 