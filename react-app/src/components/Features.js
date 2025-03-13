import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_FEATURE = gql`
  query GetFeature($id: ID!) {
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

const FeatureItem = ({ id }) => {
  const { loading, error, data } = useQuery(GET_FEATURE, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="feature-item loading">Loading feature...</div>;
  if (error) return <div className="feature-item error">Error loading feature: {error.message}</div>;
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

  // Extract feature content
  const icon = fields.field_icon || 'star';
  const title = fields.field_title || 'Feature';
  const description = fields.field_description || 'Feature description';

  return (
    <div className="feature-item">
      <div className="feature-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-text">{description}</p>
    </div>
  );
};

const Features = ({ ids, title, subtitle }) => {
  if (!ids || !ids.length) return null;

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-title">
          <h2>{title || 'Our Features'}</h2>
          <p>{subtitle || 'Discover what makes our designs stand out from the rest.'}</p>
        </div>
        <div className="row">
          {ids.map(id => (
            <FeatureItem key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 