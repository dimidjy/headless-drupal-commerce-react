import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ABOUT = gql`
  query GetAbout($id: ID!) {
    paragraph(id: $id) {
      id
      type
      fields {
        name
        value
      }
    }
  }
`;

const About = ({ id }) => {
  const { loading, error, data } = useQuery(GET_ABOUT, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="loading">Loading about section...</div>;
  if (error) return <div className="error">Error loading about section: {error.message}</div>;
  if (!data || !data.paragraph) return null;

  // Parse the paragraph fields
  const fields = {};
  data.paragraph.fields.forEach(field => {
    try {
      fields[field.name] = JSON.parse(field.value);
    } catch (e) {
      fields[field.name] = field.value;
    }
  });

  // Extract about content
  const title = fields.field_title || 'About Us';
  const content = fields.field_content || 'About us content';
  const image = fields.field_image && fields.field_image[0]
    ? fields.field_image[0].uri.replace('public://', '/sites/default/files/')
    : '';
  const buttonText = fields.field_button_text || 'Learn More';
  const buttonUrl = fields.field_button_url || '#services';

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="row">
          <div className="about-content">
            <div className="section-title text-left">
              <h2>{title}</h2>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
            <a href={buttonUrl} className="btn">{buttonText}</a>
          </div>
          <div className="about-image">
            {image && <img src={image} alt={title} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 