import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderDate, checkoutData } = location.state || {};
  const [paymentGateways, setPaymentGateways] = useState([]);
  
  // Fetch payment gateways for display info
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        const response = await fetch('/commerce/payment-gateways');
        if (response.ok) {
          const data = await response.json();
          setPaymentGateways(data);
        }
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
      }
    };
    
    fetchPaymentGateways();
  }, []);
  
  // If there's no order data, redirect to home
  if (!orderId) {
    setTimeout(() => {
      navigate('/');
    }, 3000);
    
    return (
      <div className="order-success-container">
        <h1>Order Information Not Found</h1>
        <p>Redirecting to homepage...</p>
      </div>
    );
  }
  
  // Format the date for display
  const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the selected gateway details
  const selectedGateway = paymentGateways.find(gateway => gateway.id === checkoutData?.payment?.paymentGateway);
  
  // Get payment method display text
  const getPaymentMethodText = () => {
    if (!selectedGateway) {
      return checkoutData?.payment?.paymentMethod === 'credit_card' ? 'Credit Card' : 'Online Payment';
    }
    
    return selectedGateway.configuration.display_label || selectedGateway.label;
  };
  
  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#4CAF50" fillOpacity="0.2"/>
            <path d="M27.5 42.5L17.5 32.5L21.5 28.5L27.5 34.5L42.5 19.5L46.5 23.5L27.5 42.5Z" fill="#4CAF50"/>
          </svg>
        </div>
        
        <h1>Thank You for Your Order!</h1>
        <p className="success-message">Your order has been received and is being processed.</p>
        
        <div className="order-details">
          <div className="order-info">
            <span className="label">Order Number:</span>
            <span className="value">{orderId}</span>
          </div>
          
          <div className="order-info">
            <span className="label">Date:</span>
            <span className="value">{formattedDate}</span>
          </div>
          
          <div className="order-info">
            <span className="label">Shipping Address:</span>
            <span className="value">
              {checkoutData?.shipping?.firstName} {checkoutData?.shipping?.lastName}<br />
              {checkoutData?.shipping?.address1}<br />
              {checkoutData?.shipping?.address2 && `${checkoutData.shipping.address2}<br />`}
              {checkoutData?.shipping?.city}, {checkoutData?.shipping?.state} {checkoutData?.shipping?.postalCode}
            </span>
          </div>
          
          <div className="order-info">
            <span className="label">Shipping Method:</span>
            <span className="value">
              {checkoutData?.shipping?.shippingMethod === 'standard' 
                ? 'Standard Shipping (3-5 business days)' 
                : 'Express Shipping (1-2 business days)'}
            </span>
          </div>
          
          <div className="order-info">
            <span className="label">Payment Method:</span>
            <span className="value">
              {getPaymentMethodText()}
              {selectedGateway?.plugin_id === 'liqpay_offsite_gateway' && (
                <span className="payment-note"> - Complete your payment through LiqPay to finalize your order</span>
              )}
            </span>
          </div>
        </div>
        
        <div className="order-actions">
          {selectedGateway?.plugin_id === 'liqpay_offsite_gateway' && (
            <button 
              className="btn primary"
              onClick={() => {
                // In a real implementation, this would redirect to LiqPay
                window.alert('In a production environment, this would redirect you to LiqPay to complete your payment');
              }}
            >
              Complete Payment on LiqPay
            </button>
          )}
          
          <button 
            className="btn secondary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
          
          <button 
            className="btn primary"
            onClick={() => navigate('/')}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 