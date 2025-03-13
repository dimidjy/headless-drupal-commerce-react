# ChicNest - Drupal with React Frontend

This project combines a Drupal backend with a React frontend for a modern interior design website. The Drupal backend provides content management and GraphQL API, while the React frontend delivers a responsive and interactive user experience.

## Project Structure

- `web/` - Drupal installation
- `react-app/` - React frontend application

## Drupal Backend Setup

1. Install the custom GraphQL module:
   ```
   drush en custom_graphql -y
   ```

2. Clear the cache:
   ```
   drush cr
   ```

3. Verify the GraphQL endpoint is working by visiting:
   ```
   /graphql
   ```

4. Create content with paragraphs:
   - Create a content type with a field_paragraphs field (Entity reference revisions to Paragraph)
   - Create paragraph types with appropriate fields
   - Add paragraphs to your content

## React Frontend Setup

1. Navigate to the React app directory:
   ```
   cd react-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

   If you encounter errors about missing dependencies, install them explicitly:
   ```
   npm install react-router-dom @apollo/client graphql
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## GraphQL API Usage

The GraphQL API allows fetching paragraph entities by ID. Example query:

```graphql
query GetParagraph($id: ID!) {
  paragraph(id: $id) {
    id
    type
    fields {
      name
      value
    }
  }
}
```

## Content Structure

The website uses a simple content structure:

1. Create a node with field_paragraphs
2. Add various paragraph types to this field
3. The React frontend will display these paragraphs in order

Currently, the header and footer are simple placeholders that will be implemented later.

## Paragraph Types

Create paragraph types in Drupal with fields like:

- field_title - Title text
- field_text - Body text
- field_image - Image field
- field_link - Link field

The React frontend will render these fields appropriately based on their names.

## Page Configuration

The page configuration is provided through a REST endpoint at `/api/page-config`, which returns:

```json
{
  "header_placeholder": "Header placeholder - will be implemented later",
  "footer_placeholder": "Footer placeholder - will be implemented later",
  "paragraph_ids": [1, 2, 3]
}
```

## Development Workflow

1. Create and manage content in Drupal
2. Expose content via GraphQL
3. Fetch and render content in React components
4. Style components using the provided CSS

## Troubleshooting

- If GraphQL queries fail, check that the custom_graphql module is enabled and the schema is properly registered
- If paragraph data is not displaying correctly, verify the field names in both Drupal and React components
- For CORS issues, ensure proper configuration in Drupal's services.yml file
- If you encounter errors about missing dependencies like 'react-router-dom', install them using npm as described in the React Frontend Setup section

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