import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

  console.log(data)
  console.log(loading)
  console.log(error)

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

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="page-title">{page.title}</h1>
        <div className="paragraphs-container">
          {page.paragraphs && page.paragraphs.map((paragraph, index) => (
            <div key={paragraph.id || index} className={`paragraph paragraph-${paragraph.__typename.replace('Paragraph', '').toLowerCase()}`}>
              {/* Render different paragraph types */}
              {paragraph.__typename === 'ParagraphBillboard' && (
                <div className="billboard">
                  <h2>{paragraph.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: paragraph.description }} />
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphCategories' && (
                <div className="categories">
                  <h2>{paragraph.title}</h2>
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphFeatures' && (
                <div className="features">
                  <h2>{paragraph.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: paragraph.description }} />
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphFollowUs' && (
                <div className="follow-us">
                  <h2>{paragraph.title}</h2>
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphLogoBar' && (
                <div className="logo-bar">
                  {paragraph.image && paragraph.image.mediaImage && (
                    <img 
                      src={paragraph.image.mediaImage.url} 
                      alt={paragraph.image.mediaImage.alt || ''} 
                      width={paragraph.image.mediaImage.width}
                      height={paragraph.image.mediaImage.height}
                    />
                  )}
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphProductsSlider' && (
                <div className="products-slider">
                  <h2>{paragraph.title}</h2>
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphTestimonials' && (
                <div className="testimonials">
                  <h2>Testimonials</h2>
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphTestimonialsItem' && (
                <div className="testimonial-item">
                  <p className="author">{paragraph.author}</p>
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphTextAndImage' && (
                <div className="text-and-image">
                  <h2>{paragraph.title}</h2>
                  {paragraph.link && (
                    <a href={paragraph.link.url} className="cta-link">
                      {paragraph.link.title}
                    </a>
                  )}
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphVideo' && (
                <div className="video">
                  {paragraph.video && paragraph.video.__typename === 'MediaRemoteVideo' && (
                    <div dangerouslySetInnerHTML={{ __html: paragraph.video.mediaOembedVideo }} />
                  )}
                  {paragraph.video && paragraph.video.__typename === 'MediaVideo' && paragraph.video.mediaVideoFile && (
                    <video controls>
                      <source src={paragraph.video.mediaVideoFile.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              
              {paragraph.__typename === 'ParagraphWebform' && (
                <div className="webform">
                  <p>Webform placeholder</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 