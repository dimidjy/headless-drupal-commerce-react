import { gql } from '@apollo/client';

export const PARAGRAPH_PRODUCTS_SLIDER_FRAGMENT = gql`
  fragment ParagraphProductsSliderFragment on ParagraphProductsSlider {
    id
    title
    productsList {
      ... on CommerceProductDefault {
        id
        variations {
          ... on CommerceProductVariationDefault {
            id
            productImage {
              id
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
            price
          }
        }
      }
    }
  }
`;
