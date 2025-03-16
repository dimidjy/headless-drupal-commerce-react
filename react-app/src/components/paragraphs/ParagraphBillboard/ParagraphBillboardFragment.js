import { gql } from '@apollo/client';

export const PARAGRAPH_BILLBOARD_FRAGMENT = gql`
  fragment ParagraphBillboardFragment on ParagraphBillboard {
    id
    description
    title
    slides {
      ... on ParagraphBillboardSlide {
        title
        description
        image {
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
        link {
          title
          url
        }
      }
    }
  }
`; 