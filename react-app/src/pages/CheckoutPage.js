import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  
  // For now, we'll use static data for the cart summary
  const cartSummary = {
    items: [
      {
        id: 1,
        title: 'Modern Sofa',
        price: 899.99,
        quantity: 1
      },
      {
        id: 3,
        title: 'Accent Chair',
        price: 349.99,
        quantity: 2
      }
    ],
    subtotal: 1599.97,
    tax: 128.00,
    total: 1727.97
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Basic validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    
    if (formData.paymentMethod === 'credit') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.cardName.trim()) errors.cardName = 'Name on card is required';
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) errors.cvv = 'CVV is required';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Here you would typically send the order to your backend
    console.log('Order submitted:', { formData, cartSummary });
    
    // Show success message
    setOrderPlaced(true);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      paymentMethod: 'credit',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: ''
    });
    
    // Clear errors
    setFormErrors({});
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="container">
          <div className="success-message">
            <h1>Thank You for Your Order!</h1>
            <p>Your order has been placed successfully.</p>
            <p>Order confirmation has been sent to your email.</p>
            <button className="btn" onClick={handleReturnHome}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <h2>Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={formErrors.firstName ? 'error' : ''}
                  />
                  {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={formErrors.lastName ? 'error' : ''}
                  />
                  {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={formErrors.address ? 'error' : ''}
                />
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={formErrors.city ? 'error' : ''}
                  />
                  {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={formErrors.state ? 'error' : ''}
                  />
                  {formErrors.state && <span className="error-message">{formErrors.state}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={formErrors.zipCode ? 'error' : ''}
                  />
                  {formErrors.zipCode && <span className="error-message">{formErrors.zipCode}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              
              <h2>Payment Information</h2>
              <div className="form-group payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="credit"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                  />
                  <label htmlFor="credit">Credit Card</label>
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
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                <div className="credit-card-details">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={formErrors.cardNumber ? 'error' : ''}
                    />
                    {formErrors.cardNumber && <span className="error-message">{formErrors.cardNumber}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={formErrors.cardName ? 'error' : ''}
                    />
                    {formErrors.cardName && <span className="error-message">{formErrors.cardName}</span>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={formErrors.expiryDate ? 'error' : ''}
                      />
                      {formErrors.expiryDate && <span className="error-message">{formErrors.expiryDate}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        className={formErrors.cvv ? 'error' : ''}
                      />
                      {formErrors.cvv && <span className="error-message">{formErrors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}
              
              <button type="submit" className="btn place-order-btn">
                Place Order
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartSummary.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cartSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>${cartSummary.tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${cartSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 