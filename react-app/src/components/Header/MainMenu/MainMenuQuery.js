import { gql } from '@apollo/client';

export const MAIN_MENU_QUERY = gql`
  query MainMenuQuery {
    menu (name: MAIN) {
      id
      items {
        id
        url
        title
      }
    }
  }
`; 