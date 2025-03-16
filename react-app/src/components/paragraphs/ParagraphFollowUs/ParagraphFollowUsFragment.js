import { gql } from '@apollo/client';

export const PARAGRAPH_FOLLOW_US_FRAGMENT = gql`
  fragment ParagraphFollowUsFragment on ParagraphFollowUs {
    id
    title
  }
`; 