import { gql } from '@apollo/client';

export const PARAGRAPH_FEATURES_FRAGMENT = gql`
  fragment ParagraphFeaturesFragment on ParagraphFeatures {
    id
    items {
      ... on ParagraphFeaturesItem {
        title
        description
        featureImage {
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
  }
`; 