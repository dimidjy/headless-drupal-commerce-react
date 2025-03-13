import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
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

const TestimonialItem = ({ id }) => {
  const { loading, error, data } = useQuery(GET_TESTIMONIAL, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="testimonial-item loading">Loading testimonial...</div>;
  if (error) return <div className="testimonial-item error">Error loading testimonial: {error.message}</div>;
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

  // Extract testimonial content
  const quote = fields.field_quote || 'Testimonial quote';
  const name = fields.field_name || 'Client Name';
  const position = fields.field_position || 'Client Position';
  const image = fields.field_image && fields.field_image[0]
    ? fields.field_image[0].uri.replace('public://', '/sites/default/files/')
    : '';

  return (
    <div className="testimonial-item">
      <div className="testimonial-text">
        <p>{quote}</p>
      </div>
      <div className="testimonial-author">
        {image && <img src={image} alt={name} />}
        <h4 className="testimonial-name">{name}</h4>
        <p className="testimonial-position">{position}</p>
      </div>
    </div>
  );
};

const Testimonials = ({ ids, title, subtitle }) => {
  if (!ids || !ids.length) return null;

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-title">
          <h2>{title || 'Client Testimonials'}</h2>
          <p>{subtitle || 'What our clients say about our services and designs.'}</p>
        </div>
        <div className="row">
          {ids.map(id => (
            <TestimonialItem key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 