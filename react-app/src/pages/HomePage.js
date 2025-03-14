import React from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  ParagraphBillboard,
  ParagraphBlogPosts,
  ParagraphCategories,
  ParagraphFeatures,
  ParagraphFollowUs,
  ParagraphLogoBar,
  ParagraphProductsSlider,
  ParagraphTestimonials,
  ParagraphTestimonialsItem,
  ParagraphTextAndImage,
  ParagraphVideo,
  ParagraphWebform
} from '../components/paragraphs';

// Define the GraphQL query for fetching the homepage data
const GET_HOME_PAGE = gql`
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

const HomePage = ({ homepageUuid }) => {
  console.log(homepageUuid)
  const { loading, error, data } = useQuery(GET_HOME_PAGE, {
    variables: { id: homepageUuid },
    skip: !homepageUuid,
  });

  if (!homepageUuid) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="no-uuid">
            <h2>No UUID available</h2>
            <p>Homepage UUID is not available.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="loading">
            <h2>Loading...</h2>
            <p>Fetching homepage content.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="error">
            <h2>Error</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const page = data?.nodePage;

  if (!page) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="no-content">
            <h2>No content available</h2>
            <p>The homepage content could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render the appropriate component based on paragraph type
  const renderParagraph = (paragraph) => {
    switch (paragraph.__typename) {
      case 'ParagraphBillboard':
        return <ParagraphBillboard title={paragraph.title} description={paragraph.description} />;
      
      case 'ParagraphBlogPosts':
        return <ParagraphBlogPosts posts={paragraph.posts} />;
      
      case 'ParagraphCategories':
        return <ParagraphCategories title={paragraph.title} />;
      
      case 'ParagraphFeatures':
        return <ParagraphFeatures title={paragraph.title} description={paragraph.description} image={paragraph.image} />;
      
      case 'ParagraphFollowUs':
        return <ParagraphFollowUs title={paragraph.title} />;
      
      case 'ParagraphLogoBar':
        return <ParagraphLogoBar image={paragraph.image} />;
      
      case 'ParagraphProductsSlider':
        return <ParagraphProductsSlider title={paragraph.title} />;
      
      case 'ParagraphTestimonials':
        return <ParagraphTestimonials />;
      
      case 'ParagraphTestimonialsItem':
        return <ParagraphTestimonialsItem author={paragraph.author} />;
      
      case 'ParagraphTextAndImage':
        return <ParagraphTextAndImage title={paragraph.title} link={paragraph.link} image={paragraph.image} />;
      
      case 'ParagraphVideo':
        return <ParagraphVideo video={paragraph.video} />;
      
      case 'ParagraphWebform':
        return <ParagraphWebform />;
      
      default:
        return null;
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">{page.title}</h1>
        <div className="paragraphs-container">
          {page.paragraphs && page.paragraphs.map((paragraph, index) => (
            <div key={paragraph.id || index} className={`paragraph paragraph-${paragraph.__typename.replace('Paragraph', '').toLowerCase()}`}>
              {renderParagraph(paragraph)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 