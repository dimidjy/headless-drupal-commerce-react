import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../../graphql/queries/product';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const productUuid = location.state?.productUuid || id;
  
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: productUuid },
    skip: !productUuid,
  });

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
          
          {product.body?.processed && (
            <div 
              className="product-detail-description"
              dangerouslySetInnerHTML={{ __html: product.body.processed }} 
            />
          )}
          
          <div className="product-detail-actions">
            <button className="btn product-detail-add-to-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 