import { gql } from '@apollo/client';

// Define the GraphQL query for fetching the homepage data
export const GET_HOME_PAGE = gql`
  query GetHomePage($id: ID!) {
    nodePage(id: $id) {
      paragraphs {
        ... on ParagraphBillboard {
          id
          description
          title
        }
        ... on ParagraphBlogPosts {
          id
          posts {
            id
          }
        }
        ... on ParagraphCategories {
          id
          title
        }
        ... on ParagraphFeatures {
          id
          image {
            id
          }
          description
          title
        }
        ... on ParagraphFollowUs {
          id
          title
        }
        ... on ParagraphLogoBar {
          id
          image {
            mediaImage {
              width
              url
              title
              height
              alt
            }
          }
        }
        ... on ParagraphProductsSlider {
          id
          title
        }
        ... on ParagraphTestimonials {
          id
        }
        ... on ParagraphTestimonialsItem {
          id
          author
        }
        ... on ParagraphTextAndImage {
          id
          image {
            id
          }
          title
          link {
            title
            url
          }
        }
        ... on ParagraphVideo {
          id
          video {
            ... on MediaRemoteVideo {
              id
              name
              mediaOembedVideo
            }
            ... on MediaVideo {
              id
              name
              mediaVideoFile {
                url
                name
              }
            }
          }
        }
        ... on ParagraphWebform {
          id
        }
      }
      path
      title
    }
  }
`; 