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
        
        // GraphQL query to fetch paragraph by ID - exactly matching Postman format
        const query = `query GetParagraph($id: ID!) { paragraph(id: $id) { id, type, uuid, fields {name, value} } }`;

        // Use a relative URL which will be proxied through the development server
        // This avoids CORS issues since the request appears to come from the same origin
        const response = await axios.post('/api/graphql', {
          query,
          variables: {
            id: id.toString() // Ensure ID is a string as in Postman
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
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
        console.error('Full error object:', err);
        console.error('Response data:', err.response?.data);
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

  console.log('Paragraph:', paragraph);
  // Render the paragraph based on its type
  return (
    <div className={`paragraph paragraph-${paragraph.type}`} data-id={paragraph.id}>
      {paragraph.fields.map((field) => {
        const fieldValue = parseFieldValue(field);
        
        
        // Render different field types appropriately
        switch (field.name) {
          case 'field_image':
            console.log('Field image:', fieldValue);
            if (fieldValue.url) {
              return (
                <div key={field.name} className="paragraph-field paragraph-field-image">
                  <img src={fieldValue.url} alt={fieldValue.alt || ''} title={fieldValue.title || ''} />
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
            console.log('Field value:', fieldValue);
            console.log(Array.isArray(fieldValue));
            console.log(fieldValue?.uri);

            if (fieldValue.url) {
              return (
                <a 
                  key={field.name} 
                  className="paragraph-field paragraph-field-link"
                  href={fieldValue.url}
                  target={fieldValue.options?.target || '_self'}
                >
                  {fieldValue.title || fieldValue[0].url}
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