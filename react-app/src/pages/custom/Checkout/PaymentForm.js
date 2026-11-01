import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';
import { API_BASE_URL } from '../../../utils/config';

const PaymentForm = ({ initialData, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    paymentMethod: '',
    paymentGateway: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    ...initialData
  });
  
  const [errors, setErrors] = useState({});
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  
  // Fetch available payment gateways
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/commerce/payment-gateways`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch payment gateways: ${response.statusText}`);
        }
        
        const data = await response.json();
        setPaymentGateways(data);
        
        // Set default payment method if there are gateways available and no method was previously selected
        if (data.length > 0) {
          setFormData(prevData => (prevData.paymentGateway ? prevData : {
            ...prevData,
            paymentGateway: data[0].id,
            paymentMethod: data[0].configuration.payment_method_types[0] || 'credit_card'
          }));
        }
        
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentGateways();
  }, []);
  
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);
  
  const handlePaymentMethodSelect = (gateway) => {
    const selectedGateway = paymentGateways.find(g => g.id === gateway.id);
    const defaultPaymentMethod = selectedGateway?.configuration?.payment_method_types?.[0] || 'credit_card';
    
    setFormData(prevData => ({
      ...prevData,
      paymentGateway: gateway.id,
      paymentMethod: defaultPaymentMethod
    }));
    
    // Clear any related errors
    if (errors.paymentGateway) {
      setErrors(prevErrors => ({
        ...prevErrors,
        paymentGateway: null
      }));
    }
  };
  
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
    
    // Get selected gateway
    const selectedGateway = paymentGateways.find(gateway => gateway.id === formData.paymentGateway);
    
    // Skip validation for offsite gateways like Liqpay
    if (selectedGateway?.plugin_id === 'liqpay_offsite_gateway') {
      return true;
    }
    
    // For manual gateway with credit card payment method
    if (formData.paymentMethod === 'credit_card' && selectedGateway?.plugin_id === 'manual') {
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
  
  const handleLiqpayRedirect = () => {
    // Set payment method to Liqpay first
    const liqpayGateway = paymentGateways.find(gateway => gateway.plugin_id === 'liqpay_offsite_gateway');
    if (liqpayGateway) {
      setFormData(prevData => ({
        ...prevData,
        paymentGateway: liqpayGateway.id,
        paymentMethod: liqpayGateway.configuration.payment_method_types[0] || 'credit_card'
      }));
      
      // Continue with form submission
      onSave({
        paymentGateway: liqpayGateway.id,
        paymentMethod: liqpayGateway.configuration.payment_method_types[0] || 'credit_card'
      });
    }
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
  
  // Get the selected gateway
  const selectedGateway = paymentGateways.find(gateway => gateway.id === formData.paymentGateway);
  
  // Determine if we're using Manual payment
  const isManualPayment = selectedGateway?.plugin_id === 'manual';
  
  
  if (isLoading) {
    return (
      <div className="checkout-form payment-form">
        <h2>Payment Information</h2>
        <div className="loading-spinner">Loading payment options...</div>
      </div>
    );
  }
  
  if (loadError) {
    return (
      <div className="checkout-form payment-form">
        <h2>Payment Information</h2>
        <div className="error-message">
          <p>Failed to load payment options. Please try again later.</p>
          <p>{loadError}</p>
        </div>
      </div>
    );
  }
  
  if (paymentGateways.length === 0) {
    return (
      <div className="checkout-form payment-form">
        <h2>Payment Information</h2>
        <div className="error-message">
          <p>No payment methods are currently available. Please contact customer support.</p>
        </div>
      </div>
    );
  }
  
  // Find specific gateways
  const liqpayGateway = paymentGateways.find(gateway => gateway.plugin_id === 'liqpay_offsite_gateway');
  const manualGateway = paymentGateways.find(gateway => gateway.plugin_id === 'manual');
  
  return (
    <div className="checkout-form payment-form">
      <h2>Payment Information</h2>
      
      <form onSubmit={handleSubmit}>
        <h3>Choose a Payment Method</h3>
        
        <div className="payment-methods">
          {/* Liqpay Payment Method */}
          {liqpayGateway && (
            <div 
              className={`payment-method ${formData.paymentGateway === liqpayGateway.id ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect(liqpayGateway)}
            >
              <div className="payment-method-content">
                <div className="payment-method-header">
                  <div className="payment-method-logo liqpay"></div>
                  <h4>{liqpayGateway.configuration.display_label || liqpayGateway.label}</h4>
                </div>
                <div className="payment-method-description">
                  <p>Secure online payment with LiqPay. Supports credit cards, Google Pay, Apple Pay, and Privat24.</p>
                  <button 
                    type="button" 
                    className="btn primary liqpay-btn" 
                    onClick={handleLiqpayRedirect}
                  >
                    Pay with LiqPay
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Manual Payment Method */}
          {manualGateway && (
            <div 
              className={`payment-method ${formData.paymentGateway === manualGateway.id ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect(manualGateway)}
            >
              <div className="payment-method-content">
                <div className="payment-method-header">
                  <h4>{manualGateway.configuration.display_label || manualGateway.label}</h4>
                </div>
                <div className="payment-method-description">
                  {manualGateway.configuration.instructions?.value ? (
                    <div className="manual-payment-instructions" dangerouslySetInnerHTML={{ __html: manualGateway.configuration.instructions.value }}></div>
                  ) : (
                    <p>Complete your payment manually following the provided instructions.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Credit Card Form for Manual Payment */}
        {isManualPayment && formData.paymentMethod === 'credit_card' && (
          <div className="card-fields">
            <h3>Credit Card Details</h3>
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