import React from 'react';
import './CheckoutForms.css';

const ReviewOrder = ({ checkoutData, cart, onBack, onEditStep, onPlaceOrder }) => {
  const { shipping, billing, payment, sameAsShipping } = checkoutData;
  
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return '';
    // Keep only last 4 digits and mask the rest
    return `**** **** **** ${cardNumber.slice(-4)}`;
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
            {payment.paymentMethod === 'credit_card' ? (
              <p>
                <strong>Payment Method:</strong> Credit Card<br />
                <strong>Card Number:</strong> {formatCardNumber(payment.cardNumber)}<br />
                <strong>Name on Card:</strong> {payment.cardName}<br />
                <strong>Expiry Date:</strong> {payment.expiryMonth}/{payment.expiryYear}
              </p>
            ) : (
              <p>
                <strong>Payment Method:</strong> PayPal<br />
                You will be redirected to PayPal to complete your payment.
              </p>
            )}
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
                <span>{cart?.total?.formatted}</span>
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
                  ${(parseFloat(cart?.total?.number || 0) + 
                     (shipping.shippingMethod === 'standard' ? 5.99 : 15.99)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn secondary" onClick={onBack}>Back</button>
        <button type="button" className="btn primary" onClick={onPlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default ReviewOrder; 