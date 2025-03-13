import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_FOOTER = gql`
  query GetFooter($id: ID!) {
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

const Footer = ({ id }) => {
  const { loading, error, data } = useQuery(GET_FOOTER, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="loading">Loading footer...</div>;
  if (error) return <div className="error">Error loading footer: {error.message}</div>;
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

  // Extract footer content
  const companyName = fields.field_company_name || 'ChicNest';
  const companyDescription = fields.field_company_description || 'Elegant and Modern Interior Design Solutions';
  const quickLinks = fields.field_quick_links || [
    { title: 'Home', url: '#home' },
    { title: 'About', url: '#about' },
    { title: 'Services', url: '#services' },
    { title: 'Portfolio', url: '#portfolio' },
    { title: 'Contact', url: '#contact' },
  ];
  const services = fields.field_services || [
    { title: 'Interior Design', url: '#' },
    { title: 'Exterior Design', url: '#' },
    { title: 'Furniture Design', url: '#' },
    { title: 'Home Decoration', url: '#' },
    { title: 'Consultation', url: '#' },
  ];
  const socialLinks = fields.field_social_links || [
    { platform: 'facebook', url: '#' },
    { platform: 'twitter', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
  ];
  const copyright = fields.field_copyright || `© ${new Date().getFullYear()} ${companyName}. All Rights Reserved.`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">{companyName}</h3>
            <p>{companyDescription}</p>
            <div className="footer-social">
              {Array.isArray(socialLinks) && socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                  <i className={`fab fa-${link.platform}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              {Array.isArray(quickLinks) && quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url}>{link.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Our Services</h3>
            <ul className="footer-links">
              {Array.isArray(services) && services.map((service, index) => (
                <li key={index}>
                  <a href={service.url}>{service.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-links">
              <li>
                <i className="fas fa-map-marker-alt"></i> {fields.field_address || '123 Design Street, Creative City'}
              </li>
              <li>
                <i className="fas fa-envelope"></i> {fields.field_email || 'info@chicnest.com'}
              </li>
              <li>
                <i className="fas fa-phone-alt"></i> {fields.field_phone || '+1 (123) 456-7890'}
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 