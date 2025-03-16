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
        ... on ParagraphBlogPosts {
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
        ... on ParagraphCategories {
          id
          categories {
            ... on TermShop {
              name
              shopImage {
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
        ... on ParagraphFeatures {
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
        ... on ParagraphFollowUs {
          id
          title
        }
        ... on ParagraphLogoBar {
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
        ... on ParagraphProductsSlider {
          id
          title
          productsList {
            ... on CommerceProductDefault {
              id
              variations {
                ... on CommerceProductVariationDefault {
                  id
                  productImage {
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
                  price
                }
              }
            }
          }
        }
        ... on ParagraphTestimonials {
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
        ... on ParagraphTextAndImage {
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