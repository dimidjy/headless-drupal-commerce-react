import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_SERVICE = gql`
  query GetService($id: ID!) {
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

const ServiceItem = ({ id }) => {
  const { loading, error, data } = useQuery(GET_SERVICE, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="service-item loading">Loading service...</div>;
  if (error) return <div className="service-item error">Error loading service: {error.message}</div>;
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

  // Extract service content
  const icon = fields.field_icon || 'cog';
  const title = fields.field_title || 'Service';
  const description = fields.field_description || 'Service description';

  return (
    <div className="service-item">
      <div className="service-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-text">{description}</p>
    </div>
  );
};

const Services = ({ ids, title, subtitle }) => {
  if (!ids || !ids.length) return null;

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-title">
          <h2>{title || 'Our Services'}</h2>
          <p>{subtitle || 'We offer a wide range of interior design services to meet your needs.'}</p>
        </div>
        <div className="row">
          {ids.map(id => (
            <ServiceItem key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services; 