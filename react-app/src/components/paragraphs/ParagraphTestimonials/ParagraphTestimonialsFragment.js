import { gql } from '@apollo/client';

export const PARAGRAPH_TESTIMONIALS_FRAGMENT = gql`
  fragment ParagraphTestimonialsFragment on ParagraphTestimonials {
    id
    title
    testimonials {
      ... on ParagraphTestimonialsItem {
        id
        author
        response
      }
    }
  }
`; 