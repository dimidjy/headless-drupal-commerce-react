import React, { useState } from 'react';
import axios from 'axios';
import './ParagraphWebform.css';

const ParagraphWebform = ({ title, description }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    
    // Validate email
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    try {
      // Send request to the webform_rest/submit endpoint
      await axios.post('/webform_rest/submit', {
        webform_id: 'contact',
        email: email
      });
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to submit. Please try again later.');
      console.error('Newsletter signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="webform newsletter-signup">
      <div className="newsletter-background">
        <h2 className="newsletter-title">{title || 'CONTACT US'}</h2>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className={`newsletter-input ${error ? 'input-error' : ''}`}
                disabled={isSubmitting}
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <button 
              type="submit" 
              className="newsletter-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <p>Thank you for contacting us! We will get back to you soon.</p>
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="newsletter-button"
            >
              SUBMIT ANOTHER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParagraphWebform; 