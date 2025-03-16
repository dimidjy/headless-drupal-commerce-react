import { gql } from '@apollo/client';

export const PARAGRAPH_TEXT_AND_IMAGE_FRAGMENT = gql`
  fragment ParagraphTextAndImageFragment on ParagraphTextAndImage {
    id
    image {
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
    title
    description
    link {
      title
      url
    }
  }
`; 