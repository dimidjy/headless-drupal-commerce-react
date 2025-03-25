import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../../graphql/queries/product';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const productUuid = location.state?.productUuid || id;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: productUuid },
    skip: !productUuid,
  });

  useEffect(() => {
    // Set the first available variation as selected when data loads
    if (data?.commerceProductDefault?.variations?.length > 0) {
      const availableVariations = data.commerceProductDefault.variations.filter(
        variation => variation.status
      );
      if (availableVariations.length > 0) {
        setSelectedVariation(availableVariations[0]);
      }
    }
  }, [data]);

  const addToCart = async () => {
    if (!selectedVariation) return;
    
    setAddingToCart(true);
    setCartMessage(null);
    
    try {
      // Prepare the payload as expected by commerce_cart_api
      const cartItemData = [{
        purchased_entity_type: 'commerce_product_variation',
        purchased_entity_id: selectedVariation.id,
        quantity: quantity,
        combine: true
      }];
      
      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItemData),
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error adding to cart: ${response.statusText}`);
      }
      
      const result = await response.json();
      setCartMessage({ type: 'success', text: 'Product added to cart successfully!' });
    } catch (error) {
      console.error('Add to cart error:', error);
      setCartMessage({ type: 'error', text: error.message });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-loading">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="product-error">Error loading product: {error.message}</div>
      </div>
    );
  }

  if (!data || !data.commerceProductDefault) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">Product not found</div>
      </div>
    );
  }

  const { commerceProductDefault: product } = data;
  const imageUrl = product.image?.mediaImage?.url;
  const mediumImageUrl = product.image?.mediaImage?.variations?.[0]?.url;
  
  // Get available variations (status = true)
  const availableVariations = product.variations?.filter(variation => variation.status) || [];
  const hasVariations = availableVariations.length > 0;

  const handleVariationChange = (e) => {
    const variationId = e.target.value;
    const variation = availableVariations.find(v => v.id === variationId);
    setSelectedVariation(variation);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-detail-image">
          {imageUrl && (
            <img 
              src={mediumImageUrl || imageUrl} 
              alt={product.image?.mediaImage?.alt || 'Product image'} 
            />
          )}
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.title}</h1>
          
          {selectedVariation && selectedVariation.price && (
            <div className="product-detail-price">
              {selectedVariation.price}
            </div>
          )}
          
          {product.body?.processed && (
            <div 
              className="product-detail-description"
              dangerouslySetInnerHTML={{ __html: product.body.processed }} 
            />
          )}
          
          <div className="product-detail-actions">
            {availableVariations.length > 1 && (
              <div className="product-variation-selector">
                <label htmlFor="variation-select">Select Option:</label>
                <select 
                  id="variation-select"
                  value={selectedVariation?.id || ''}
                  onChange={handleVariationChange}
                  className="variation-select"
                >
                  {availableVariations.map(variation => (
                    <option key={variation.id} value={variation.id}>
                      {variation.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="product-quantity-container">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="product-quantity-input"
              />
            </div>
            
            {cartMessage && (
              <div className={`cart-message ${cartMessage.type}`}>
                {cartMessage.text}
              </div>
            )}
            
            <button 
              className="btn product-detail-add-to-cart"
              onClick={addToCart}
              disabled={addingToCart || !hasVariations || !selectedVariation}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            {!hasVariations && (
              <div className="product-variation-error">
                This product is currently unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 