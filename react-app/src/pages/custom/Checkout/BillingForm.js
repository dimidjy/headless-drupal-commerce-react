import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';

const BillingForm = ({ initialData, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'address1', 'city', 
      'state', 'postalCode', 'country'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Postal code validation (basic format for US)
    if (formData.country === 'US' && formData.postalCode && !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid ZIP code (12345 or 12345-6789)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return (
    <div className="checkout-form billing-form">
      <h2>Billing Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="address1">Address Line 1*</label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className={errors.address1 ? 'error' : ''}
          />
          {errors.address1 && <div className="field-error">{errors.address1}</div>}
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="address2">Address Line 2</label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <div className="field-error">{errors.city}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="state">State/Province*</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            />
            {errors.state && <div className="field-error">{errors.state}</div>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code*</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? 'error' : ''}
            />
            {errors.postalCode && <div className="field-error">{errors.postalCode}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country*</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={errors.country ? 'error' : ''}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
            {errors.country && <div className="field-error">{errors.country}</div>}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={onBack}>Back to Shipping</button>
          <button type="submit" className="btn primary">Continue to Payment</button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm; 