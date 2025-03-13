import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

// GraphQL query for products (placeholder - adjust based on your actual schema)
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      price
      image
    }
  }
`;

const ProductListPage = () => {
  // For now, we'll use static data since we don't have the actual GraphQL schema
  const [products, setProducts] = useState([
    { id: 1, title: 'Modern Sofa', price: 899.99, image: '/images/products/sofa.jpg' },
    { id: 2, title: 'Dining Table', price: 649.99, image: '/images/products/table.jpg' },
    { id: 3, title: 'Accent Chair', price: 349.99, image: '/images/products/chair.jpg' },
    { id: 4, title: 'Coffee Table', price: 249.99, image: '/images/products/coffee-table.jpg' },
    { id: 5, title: 'Floor Lamp', price: 129.99, image: '/images/products/lamp.jpg' },
    { id: 6, title: 'Bookshelf', price: 399.99, image: '/images/products/bookshelf.jpg' },
  ]);

  // Uncomment this when you have the actual GraphQL schema
  /*
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error loading products: {error.message}</div>;
  */

  return (
    <div className="product-list-page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <Link to={`/products/${product.id}`} className="btn">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage; 