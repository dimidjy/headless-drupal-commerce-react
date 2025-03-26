import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';

const ShippingForm = ({ initialData, onSave, sameAsShipping, onSameAsShippingChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    shippingMethod: 'standard',
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
      'firstName', 'lastName', 'email', 'phone', 
      'address1', 'city', 'state', 'postalCode', 'country'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic format)
    if (formData.phone && !/^\+?[0-9\s\-()]{10,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
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

  const handleShippingMethodChange = (method) => {
    setFormData(prevData => ({
      ...prevData,
      shippingMethod: method
    }));
  };
  
  return (
    <div className="checkout-form shipping-form">
      <h2>Shipping Information</h2>
      
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
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
        </div>
        
        <div className="form-group">
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
        
        <div className="form-group">
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
        
        <div className="form-section">
          <h3>Shipping Method</h3>
          <div className="shipping-methods">
            <div 
              className={`shipping-method ${formData.shippingMethod === 'standard' ? 'selected' : ''}`}
              onClick={() => handleShippingMethodChange('standard')}
            >
              <input
                type="radio"
                id="shipping-standard"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === 'standard'}
                onChange={() => handleShippingMethodChange('standard')}
              />
              <div className="shipping-method-label">
                <div className="method-name">Standard Shipping</div>
                <div className="method-description">3-5 business days</div>
              </div>
              <div className="shipping-method-price">$5.99</div>
            </div>
            
            <div 
              className={`shipping-method ${formData.shippingMethod === 'express' ? 'selected' : ''}`}
              onClick={() => handleShippingMethodChange('express')}
            >
              <input
                type="radio"
                id="shipping-express"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === 'express'}
                onChange={() => handleShippingMethodChange('express')}
              />
              <div className="shipping-method-label">
                <div className="method-name">Express Shipping</div>
                <div className="method-description">1-2 business days</div>
              </div>
              <div className="shipping-method-price">$15.99</div>
            </div>
          </div>
        </div>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsShipping}
            onChange={(e) => onSameAsShippingChange(e.target.checked)}
          />
          <label htmlFor="sameAsBilling">Billing address same as shipping</label>
        </div>
        
        <div className="form-actions">
          <div></div> {/* Empty div for spacing */}
          <button type="submit" className="btn primary">Continue to Payment</button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm; 