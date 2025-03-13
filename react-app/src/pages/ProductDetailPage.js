import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

// GraphQL query for product details (placeholder - adjust based on your actual schema)
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      price
      description
      image
      features
      specifications
    }
  }
`;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // For now, we'll use static data since we don't have the actual GraphQL schema
  const [product, setProduct] = useState({
    id: productId,
    title: 'Modern Sofa',
    price: 899.99,
    description: 'A beautiful modern sofa with clean lines and comfortable cushions. Perfect for any living room.',
    image: '/images/products/sofa.jpg',
    features: [
      'High-quality fabric upholstery',
      'Solid wood frame',
      'Foam cushions for maximum comfort',
      'Available in multiple colors'
    ],
    specifications: {
      dimensions: '84" W x 38" D x 34" H',
      weight: '120 lbs',
      material: 'Polyester fabric, solid wood',
      warranty: '2 years'
    }
  });
  
  const [quantity, setQuantity] = useState(1);

  // Uncomment this when you have the actual GraphQL schema
  /*
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
  });

  useEffect(() => {
    if (data && data.product) {
      setProduct(data.product);
    }
  }, [data]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">Error loading product details: {error.message}</div>;
  */

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    // Here you would add the product to the cart
    console.log(`Added ${quantity} of ${product.title} to cart`);
    
    // Navigate to cart page
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.title}
        </div>
        
        <div className="product-detail">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            <div className="product-features">
              <h3>Features</h3>
              <ul>
                {product.features && product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              
              <button className="btn add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-specifications">
          <h2>Specifications</h2>
          <table>
            <tbody>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <th>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 