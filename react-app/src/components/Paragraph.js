import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Paragraph = ({ id }) => {
  const [paragraph, setParagraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParagraph = async () => {
      try {
        setLoading(true);
        
        // GraphQL query to fetch paragraph by ID
        const query = `
          query GetParagraph($id: ID!) {
            paragraph(id: $id) {
              id
              type
              uuid
              fields {
                name
                value
              }
            }
          }
        `;
        
        // Make the GraphQL request to Drupal with absolute URL
        const response = await axios.post('https://chic-nest.lndo.site/api/graphql', {
          query,
          variables: { "id": id },
        }, {
          // Add headers for authentication if needed
          headers: {
            'Content-Type': 'application/json',
            // If you have authentication tokens, add them here
            // 'Authorization': 'Bearer YOUR_TOKEN'
          },
          // Ensure we're using credentials if needed for auth cookies
          withCredentials: false
        });
        
        console.log('GraphQL response:', response.data);
        
        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }
        
        setParagraph(response.data.data.paragraph);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching paragraph:', err);
        // Provide more detailed error information
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Failed to fetch paragraph: ${errorMessage}`);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchParagraph();
    }
  }, [id]);

  // Helper function to parse field values
  const parseFieldValue = (field) => {
    try {
      return JSON.parse(field.value);
    } catch (e) {
      return field.value;
    }
  };

  // Render loading state
  if (loading) {
    return <div className="paragraph-loading">Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="paragraph-error">Error: {error}</div>;
  }

  // Render if paragraph not found
  if (!paragraph) {
    return <div className="paragraph-not-found">Paragraph not found</div>;
  }

  // Render the paragraph based on its type
  return (
    <div className={`paragraph paragraph-${paragraph.type}`} data-id={paragraph.id}>
      {paragraph.fields.map((field) => {
        const fieldValue = parseFieldValue(field);
        
        // Render different field types appropriately
        switch (field.name) {
          case 'field_image':
            if (Array.isArray(fieldValue) && fieldValue[0]?.uri) {
              return (
                <div key={field.name} className="paragraph-field paragraph-field-image">
                  <img src={fieldValue[0].uri.replace('public://', '/sites/default/files/')} alt={fieldValue[0].alt || ''} />
                </div>
              );
            }
            return null;
            
          case 'field_title':
          case 'field_heading':
            return (
              <h2 key={field.name} className="paragraph-field paragraph-field-title">
                {fieldValue}
              </h2>
            );
            
          case 'field_text':
          case 'field_body':
            return (
              <div 
                key={field.name} 
                className="paragraph-field paragraph-field-text"
                dangerouslySetInnerHTML={{ __html: fieldValue }}
              />
            );
            
          case 'field_link':
            if (Array.isArray(fieldValue) && fieldValue[0]?.uri) {
              return (
                <a 
                  key={field.name} 
                  className="paragraph-field paragraph-field-link"
                  href={fieldValue[0].uri}
                  target={fieldValue[0].options?.target || '_self'}
                >
                  {fieldValue[0].title || fieldValue[0].uri}
                </a>
              );
            }
            return null;
            
          default:
            // For other field types, just display the raw value
            return (
              <div key={field.name} className={`paragraph-field paragraph-field-${field.name}`}>
                {typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue}
              </div>
            );
        }
      })}
    </div>
  );
};

export default Paragraph; 