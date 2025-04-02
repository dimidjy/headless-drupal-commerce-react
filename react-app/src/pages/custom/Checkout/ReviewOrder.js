import React, { useState, useEffect } from 'react';
import './CheckoutForms.css';

const ReviewOrder = ({ checkoutData, cart, onBack, onEditStep, onPlaceOrder }) => {
  const { shipping, billing, payment, sameAsShipping } = checkoutData;
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
  
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Keep only last 4 digits and mask the rest
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };
  
  // Get the selected gateway details
  const selectedGateway = paymentGateways.find(gateway => gateway.id === payment.paymentGateway);
  const isLiqpayOffsite = selectedGateway?.plugin_id === 'liqpay_offsite_gateway';
  const isManualPayment = selectedGateway?.plugin_id === 'manual';
  
  // Function to render payment details based on gateway type
  const renderPaymentDetails = () => {
    if (!selectedGateway) {
      return <p>Payment method information not available</p>;
    }
    
    if (isLiqpayOffsite) {
      return (
        <div>
          <p>
            <strong>Payment Method:</strong> {selectedGateway.label}<br />
            You will be redirected to Liqpay to complete your payment securely.
          </p>
        </div>
      );
    }
    
    if (isManualPayment) {
      return (
        <div>
          <p>
            <strong>Payment Method:</strong> {selectedGateway.label}<br />
            Please follow the payment instructions provided during checkout.
          </p>
        </div>
      );
    }
    
    // Default credit card display
    if (payment.paymentMethod === 'credit_card') {
      return (
        <p>
          <strong>Payment Method:</strong> {selectedGateway ? selectedGateway.label : 'Credit Card'}<br />
          <strong>Card Number:</strong> {formatCardNumber(payment.cardNumber)}<br />
          <strong>Name on Card:</strong> {payment.cardName}<br />
          <strong>Expiry Date:</strong> {payment.expiryMonth}/{payment.expiryYear}
        </p>
      );
    }
    
    return <p><strong>Payment Method:</strong> {selectedGateway.label}</p>;
  };
  
  return (
    <div className="checkout-form review-order">
      <h2>Review Your Order</h2>
      
      <div className="review-sections">
        {/* Shipping Information */}
        <div className="review-section">
          <div className="section-header">
            <h3>Shipping Information</h3>
            <button 
              type="button" 
              className="edit-button"
              onClick={() => onEditStep('shipping')}
            >
              Edit
            </button>
          </div>
          
          <div className="section-content">
            <p>
              <strong>{shipping.firstName} {shipping.lastName}</strong><br />
              {shipping.address1}<br />
              {shipping.address2 && `${shipping.address2}<br />`}
              {shipping.city}, {shipping.state} {shipping.postalCode}<br />
              {shipping.country}
            </p>
            
            <p>
              <strong>Email:</strong> {shipping.email}<br />
              <strong>Phone:</strong> {shipping.phone}
            </p>
            
            <p>
              <strong>Shipping Method:</strong><br />
              {shipping.shippingMethod === 'standard' ? 'Standard Shipping (3-5 business days)' : 'Express Shipping (1-2 business days)'}
            </p>
          </div>
        </div>
        
        {/* Billing Information */}
        <div className="review-section">
          <div className="section-header">
            <h3>Billing Information</h3>
            {!sameAsShipping && (
              <button 
                type="button" 
                className="edit-button"
                onClick={() => onEditStep('billing')}
              >
                Edit
              </button>
            )}
          </div>
          
          <div className="section-content">
            {sameAsShipping ? (
              <p>Same as shipping address</p>
            ) : (
              <p>
                <strong>{billing.firstName} {billing.lastName}</strong><br />
                {billing.address1}<br />
                {billing.address2 && `${billing.address2}<br />`}
                {billing.city}, {billing.state} {billing.postalCode}<br />
                {billing.country}
              </p>
            )}
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="review-section">
          <div className="section-header">
            <h3>Payment Information</h3>
            <button 
              type="button" 
              className="edit-button"
              onClick={() => onEditStep('payment')}
            >
              Edit
            </button>
          </div>
          
          <div className="section-content">
            {renderPaymentDetails()}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="review-section">
          <div className="section-header">
            <h3>Order Summary</h3>
          </div>
          
          <div className="section-content">
            <div className="review-order-items">
              {cart?.items?.map(item => (
                <div key={item.id} className="review-order-item">
                  <div className="item-image">
                    {item.purchased_entity?.image_url ? (
                      <img
                        src={item.purchased_entity.image_url}
                        alt={item.title}
                      />
                    ) : item.purchasedEntity?.images?.[0]?.variations?.[0]?.url && (
                      <img
                        src={item.purchasedEntity.images[0].variations[0].url}
                        alt={item.purchasedEntity.images[0].alt || item.title}
                      />
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.title}</div>
                    <div className="item-sku">SKU: {item.purchased_entity?.sku || item.purchasedEntity?.sku}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">{item.total_formatted || item.totalPrice?.formatted}</div>
                </div>
              ))}
            </div>
            
            <div className="review-order-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{cart?.total_formatted || (cart?.total && `$${parseFloat(cart.total).toFixed(2)}`) || '$0.00'}</span>
              </div>
              
              <div className="shipping-cost">
                <span>Shipping</span>
                <span>
                  {shipping.shippingMethod === 'standard' ? '$5.99' : '$15.99'}
                </span>
              </div>
              
              <div className="total">
                <span>Total</span>
                <span>
                  ${(parseFloat((cart?.total_formatted?.replace(/[^0-9.]/g, '')) || cart?.total || 0) + 
                     (shipping.shippingMethod === 'standard' ? 5.99 : 15.99)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onBack}>Back</button>
        <button 
          type="button" 
          className="btn primary" 
          onClick={onPlaceOrder}
        >
          {isLiqpayOffsite ? 'Continue to Payment' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default ReviewOrder; 