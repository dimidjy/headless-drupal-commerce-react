import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';

const PaymentForm = ({ initialData, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
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
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove non-digits
      const numbersOnly = value.replace(/\D/g, '');
      // Insert space every 4 digits
      const formatted = numbersOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      // Limit to 19 characters (16 digits + 3 spaces)
      const limited = formatted.substring(0, 19);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: limited
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
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
    
    if (formData.paymentMethod === 'credit_card') {
      // Required fields
      const requiredFields = [
        'cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'
      ];
      
      requiredFields.forEach(field => {
        if (!formData[field]) {
          newErrors[field] = 'This field is required';
        }
      });
      
      // Card number validation (basic format)
      const cardNumberDigits = formData.cardNumber.replace(/\D/g, '');
      if (cardNumberDigits.length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      // Expiry date validation
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
      const expiryYear = parseInt(formData.expiryYear, 10);
      const expiryMonth = parseInt(formData.expiryMonth, 10);
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiryMonth = 'Card has expired';
        newErrors.expiryYear = 'Card has expired';
      }
      
      // CVV validation
      if (formData.cvv && !/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Remove spaces from card number before sending
      const sanitizedData = { ...formData };
      if (sanitizedData.cardNumber) {
        sanitizedData.cardNumber = sanitizedData.cardNumber.replace(/\s/g, '');
      }
      
      onSave(sanitizedData);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.field-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  // Generate options for expiry month
  const monthOptions = [];
  for (let i = 1; i <= 12; i++) {
    const month = i.toString().padStart(2, '0');
    monthOptions.push(
      <option key={month} value={month}>
        {month}
      </option>
    );
  }
  
  // Generate options for expiry year
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 10; i++) {
    yearOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  
  return (
    <div className="checkout-form payment-form">
      <h2>Payment Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label>Payment Method*</label>
          <div className="payment-methods">
            <div className="payment-method">
              <input
                type="radio"
                id="credit-card"
                name="paymentMethod"
                value="credit_card"
                checked={formData.paymentMethod === 'credit_card'}
                onChange={handleChange}
              />
              <label htmlFor="credit-card">
                <div className="payment-logo credit-card"></div>
                <span>Credit Card</span>
              </label>
            </div>
            
            <div className="payment-method">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
              />
              <label htmlFor="paypal">
                <div className="payment-logo paypal"></div>
                <span>PayPal</span>
              </label>
            </div>
          </div>
        </div>
        
        {formData.paymentMethod === 'credit_card' && (
          <>
            <div className="form-group full-width">
              <label htmlFor="cardNumber">Card Number*</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="XXXX XXXX XXXX XXXX"
                value={formData.cardNumber}
                onChange={handleChange}
                className={errors.cardNumber ? 'error' : ''}
                maxLength={19} // 16 digits + 3 spaces
              />
              {errors.cardNumber && <div className="field-error">{errors.cardNumber}</div>}
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="cardName">Name on Card*</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={handleChange}
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <div className="field-error">{errors.cardName}</div>}
            </div>
            
            <div className="form-row">
              <div className="form-group expiry-group">
                <label htmlFor="expiryMonth">Expiry Date*</label>
                <div className="expiry-inputs">
                  <select
                    id="expiryMonth"
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleChange}
                    className={errors.expiryMonth ? 'error' : ''}
                  >
                    <option value="">MM</option>
                    {monthOptions}
                  </select>
                  <span className="expiry-separator">/</span>
                  <select
                    id="expiryYear"
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleChange}
                    className={errors.expiryYear ? 'error' : ''}
                  >
                    <option value="">YYYY</option>
                    {yearOptions}
                  </select>
                </div>
                {(errors.expiryMonth || errors.expiryYear) && (
                  <div className="field-error">{errors.expiryMonth || errors.expiryYear}</div>
                )}
              </div>
              
              <div className="form-group cvv-group">
                <label htmlFor="cvv">CVV*</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  className={errors.cvv ? 'error' : ''}
                  maxLength={4}
                />
                {errors.cvv && <div className="field-error">{errors.cvv}</div>}
              </div>
            </div>
          </>
        )}
        
        {formData.paymentMethod === 'paypal' && (
          <div className="paypal-instructions">
            <p>You will be redirected to PayPal to complete your payment after reviewing your order.</p>
          </div>
        )}
        
        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={onBack}>Back</button>
          <button type="submit" className="btn primary">Review Order</button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 