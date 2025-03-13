import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_HERO = gql`
  query GetHero($id: ID!) {
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

const Hero = ({ id }) => {
  const { loading, error, data } = useQuery(GET_HERO, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="loading">Loading hero section...</div>;
  if (error) return <div className="error">Error loading hero section: {error.message}</div>;
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

  // Extract hero content
  const title = fields.field_title || 'Welcome to ChicNest';
  const subtitle = fields.field_subtitle || 'Elegant and Modern Interior Design Solutions';
  const backgroundImage = fields.field_background_image && fields.field_background_image[0]
    ? fields.field_background_image[0].uri.replace('public://', '/sites/default/files/')
    : '';
  const buttonText = fields.field_button_text || 'Learn More';
  const buttonUrl = fields.field_button_url || '#about';

  const heroStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <section id="home" className="hero-section" style={heroStyle}>
      <div className="hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <a href={buttonUrl} className="btn">{buttonText}</a>
      </div>
    </section>
  );
};

export default Hero; 