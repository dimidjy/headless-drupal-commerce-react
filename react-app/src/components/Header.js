import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_HEADER = gql`
  query GetHeader($id: ID!) {
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

const Header = ({ id }) => {
  const { loading, error, data } = useQuery(GET_HEADER, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="loading">Loading header...</div>;
  if (error) return <div className="error">Error loading header: {error.message}</div>;
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

  // Extract logo and menu items
  const logo = fields.field_logo || 'ChicNest';
  const menuItems = fields.field_menu_items || [
    { title: 'Home', url: '#home' },
    { title: 'Features', url: '#features' },
    { title: 'About', url: '#about' },
    { title: 'Services', url: '#services' },
    { title: 'Testimonials', url: '#testimonials' },
    { title: 'Contact', url: '#contact' },
  ];

  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">{logo}</a>
        <nav>
          <ul className="nav-menu">
            {Array.isArray(menuItems) && menuItems.map((item, index) => (
              <li key={index}>
                <a href={item.url}>{item.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 