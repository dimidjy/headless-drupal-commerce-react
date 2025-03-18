import { gql } from '@apollo/client';
import {
  PARAGRAPH_BILLBOARD_FRAGMENT,
  PARAGRAPH_BLOG_POSTS_FRAGMENT,
  PARAGRAPH_CATEGORIES_FRAGMENT,
  PARAGRAPH_FEATURES_FRAGMENT,
  PARAGRAPH_FOLLOW_US_FRAGMENT,
  PARAGRAPH_LOGO_BAR_FRAGMENT,
  PARAGRAPH_PRODUCTS_SLIDER_FRAGMENT,
  PARAGRAPH_TESTIMONIALS_FRAGMENT,
  PARAGRAPH_TEXT_AND_IMAGE_FRAGMENT,
  PARAGRAPH_VIDEO_FRAGMENT,
  PARAGRAPH_WEBFORM_FRAGMENT
} from '../paragraphs/fragments';

// Define the GraphQL query for fetching the page data
export const GET_PAGE = gql`
  query GetPage($id: ID!) {
    nodePage(id: $id) {
      paragraphs {
        ... on ParagraphBillboard {
          ...ParagraphBillboardFragment
        }
        ... on ParagraphBlogPosts {
          ...ParagraphBlogPostsFragment
        }
        ... on ParagraphCategories {
          ...ParagraphCategoriesFragment
        }
        ... on ParagraphFeatures {
          ...ParagraphFeaturesFragment
        }
        ... on ParagraphFollowUs {
          ...ParagraphFollowUsFragment
        }
        ... on ParagraphLogoBar {
          ...ParagraphLogoBarFragment
        }
        ... on ParagraphProductsSlider {
          ...ParagraphProductsSliderFragment
        }
        ... on ParagraphTestimonials {
          ...ParagraphTestimonialsFragment
        }
        ... on ParagraphTextAndImage {
          ...ParagraphTextAndImageFragment
        }
        ... on ParagraphVideo {
          ...ParagraphVideoFragment
        }
        ... on ParagraphWebform {
          ...ParagraphWebformFragment
        }
      }
      path
      title
    }
  }
  ${PARAGRAPH_BILLBOARD_FRAGMENT}
  ${PARAGRAPH_BLOG_POSTS_FRAGMENT}
  ${PARAGRAPH_CATEGORIES_FRAGMENT}
  ${PARAGRAPH_FEATURES_FRAGMENT}
  ${PARAGRAPH_FOLLOW_US_FRAGMENT}
  ${PARAGRAPH_LOGO_BAR_FRAGMENT}
  ${PARAGRAPH_PRODUCTS_SLIDER_FRAGMENT}
  ${PARAGRAPH_TESTIMONIALS_FRAGMENT}
  ${PARAGRAPH_TEXT_AND_IMAGE_FRAGMENT}
  ${PARAGRAPH_VIDEO_FRAGMENT}
  ${PARAGRAPH_WEBFORM_FRAGMENT}
`; 