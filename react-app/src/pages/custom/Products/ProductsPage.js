import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../../../components/Products/ProductList';
import './ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Our Products</h1>
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <span>Products</span>
        </div>
      </div>
      
      <div className="page-content">
        <ProductList />
      </div>
    </div>
  );
};

export default ProductsPage; 