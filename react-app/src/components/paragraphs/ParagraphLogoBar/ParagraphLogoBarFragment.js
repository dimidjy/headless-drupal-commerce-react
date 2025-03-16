import { gql } from '@apollo/client';

export const PARAGRAPH_LOGO_BAR_FRAGMENT = gql`
  fragment ParagraphLogoBarFragment on ParagraphLogoBar {
    id
    image {
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
`; 