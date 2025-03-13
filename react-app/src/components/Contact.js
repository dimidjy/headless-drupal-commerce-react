import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CONTACT = gql`
  query GetContact($id: ID!) {
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

const Contact = ({ id }) => {
  const { loading, error, data } = useQuery(GET_CONTACT, {
    variables: { id },
    skip: !id,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error sending your message. Please try again.',
      });
    }
  };

  if (loading) return <div className="loading">Loading contact section...</div>;
  if (error) return <div className="error">Error loading contact section: {error.message}</div>;
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

  // Extract contact content
  const title = fields.field_title || 'Contact Us';
  const subtitle = fields.field_subtitle || 'Get in touch with us for any questions or inquiries.';
  const address = fields.field_address || '123 Design Street, Creative City';
  const email = fields.field_email || 'info@chicnest.com';
  const phone = fields.field_phone || '+1 (123) 456-7890';
  const formTitle = fields.field_form_title || 'Send us a message';

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="row">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Address</h3>
                <p>{address}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>{email}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>{phone}</p>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <h3>{formTitle}</h3>
            {formStatus.submitted && (
              <div className={`form-message ${formStatus.success ? 'success' : 'error'}`}>
                {formStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 