import { gql } from '@apollo/client';

export const PARAGRAPH_WEBFORM_FRAGMENT = gql`
  fragment ParagraphWebformFragment on ParagraphWebform {
    id
    title
    description
  }
`; 