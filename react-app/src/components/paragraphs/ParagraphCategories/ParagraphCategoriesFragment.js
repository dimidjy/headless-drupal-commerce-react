import { gql } from '@apollo/client';

export const PARAGRAPH_CATEGORIES_FRAGMENT = gql`
  fragment ParagraphCategoriesFragment on ParagraphCategories {
    id
    categories {
      ... on TermShop {
        name
        shopImage {
          mediaImage {
            width
            url
            title
            height
            alt
            variations(styles: LARGE) {
              url
            }
          }
        }
      }
    }
  }
`; 