import React, { useState } from 'react';
import ShippingForm from './ShippingForm';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import ReviewOrder from './ReviewOrder';
import './CheckoutPage.css';

// Checkout steps
const SHIPPING = 'shipping';
const BILLING = 'billing';
const PAYMENT = 'payment';
const REVIEW = 'review';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(SHIPPING);
  const [checkoutData, setCheckoutData] = useState({
    shipping: {},
    billing: {},
    payment: {},
    sameAsShipping: true
  });

  // Placeholder cart data
  const placeholderCart = {
    items: [
      {
        id: '1',
        title: 'Sample Product',
        quantity: 1,
        totalPrice: { formatted: '$99.99' }
      }
    ],
    total: { formatted: '$99.99' }
  };
  
  // Navigation between checkout steps
  const goToNextStep = () => {
    switch (currentStep) {
      case SHIPPING:
        setCurrentStep(checkoutData.sameAsShipping ? PAYMENT : BILLING);
        break;
      case BILLING:
        setCurrentStep(PAYMENT);
        break;
      case PAYMENT:
        setCurrentStep(REVIEW);
        break;
      default:
        break;
    }
  };
  
  const goToPreviousStep = () => {
    switch (currentStep) {
      case BILLING:
        setCurrentStep(SHIPPING);
        break;
      case PAYMENT:
        setCurrentStep(checkoutData.sameAsShipping ? SHIPPING : BILLING);
        break;
      case REVIEW:
        setCurrentStep(PAYMENT);
        break;
      default:
        break;
    }
  };
  
  // Update checkout data for each step
  const updateCheckoutData = (step, data) => {
    setCheckoutData(prevData => ({
      ...prevData,
      [step]: data
    }));
  };
  
  // Handle "same as shipping" checkbox for billing address
  const handleSameAsShipping = (checked) => {
    setCheckoutData(prevData => ({
      ...prevData,
      sameAsShipping: checked,
      // If checked, copy shipping data to billing
      billing: checked ? prevData.shipping : prevData.billing
    }));
  };
  
  // Get the current step component
  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case SHIPPING:
        return (
          <ShippingForm 
            initialData={checkoutData.shipping}
            onSave={(data) => {
              updateCheckoutData(SHIPPING, data);
              // If "same as shipping" is checked, also update billing data
              if (checkoutData.sameAsShipping) {
                updateCheckoutData(BILLING, data);
              }
              goToNextStep();
            }}
            sameAsShipping={checkoutData.sameAsShipping}
            onSameAsShippingChange={handleSameAsShipping}
          />
        );
      case BILLING:
        return (
          <BillingForm 
            initialData={checkoutData.billing}
            onSave={(data) => {
              updateCheckoutData(BILLING, data);
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case PAYMENT:
        return (
          <PaymentForm 
            initialData={checkoutData.payment}
            onSave={(data) => {
              updateCheckoutData(PAYMENT, data);
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
      case REVIEW:
        return (
          <ReviewOrder
            checkoutData={checkoutData}
            cart={placeholderCart}
            onBack={goToPreviousStep}
            onEditStep={(step) => setCurrentStep(step)}
            onPlaceOrder={() => handlePlaceOrder()}
          />
        );
      default:
        return null;
    }
  };
  
  // Place order function (to be implemented)
  const handlePlaceOrder = () => {
    // Placeholder for order placement
  };
  
  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      
      {/* Checkout Progress */}
      <div className="checkout-progress">
        <div className={`progress-step ${currentStep === SHIPPING ? 'active' : (currentStep === BILLING || currentStep === PAYMENT || currentStep === REVIEW) ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-name">Shipping</span>
        </div>
        {!checkoutData.sameAsShipping && (
          <div className={`progress-step ${currentStep === BILLING ? 'active' : (currentStep === PAYMENT || currentStep === REVIEW) ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-name">Billing</span>
          </div>
        )}
        <div className={`progress-step ${currentStep === PAYMENT ? 'active' : currentStep === REVIEW ? 'completed' : ''}`}>
          <span className="step-number">{checkoutData.sameAsShipping ? '2' : '3'}</span>
          <span className="step-name">Payment</span>
        </div>
        <div className={`progress-step ${currentStep === REVIEW ? 'active' : ''}`}>
          <span className="step-number">{checkoutData.sameAsShipping ? '3' : '4'}</span>
          <span className="step-name">Review</span>
        </div>
      </div>
      
      {/* Order Summary Sidebar */}
      <div className="checkout-layout">
        <div className="checkout-main">
          {getCurrentStepComponent()}
        </div>
        
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {placeholderCart.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <div className="item-name">{item.title}</div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="item-price">{item.totalPrice.formatted}</div>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div className="order-subtotal">
                <span>Subtotal</span>
                <span>{placeholderCart.total.formatted}</span>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span>{placeholderCart.total.formatted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 