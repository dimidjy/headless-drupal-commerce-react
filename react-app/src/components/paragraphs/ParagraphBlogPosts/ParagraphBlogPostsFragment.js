import { gql } from '@apollo/client';

export const PARAGRAPH_BLOG_POSTS_FRAGMENT = gql`
  fragment ParagraphBlogPostsFragment on ParagraphBlogPosts {
    id
    posts {
      ... on NodeArticle {
        id
        title
        image {
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
      }
    }
  }
`; 