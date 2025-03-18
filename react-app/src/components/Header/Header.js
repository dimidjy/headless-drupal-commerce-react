import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import MainMenu from './MainMenu/MainMenu';

const Header = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo">ChicNest</Link>
          </div>
          <MainMenu />
          <div className="header-right">
            <div className="header-right-item">
              <Link to="/wishlist" className="wishlist-link">WISHLIST (0)</Link>
            </div>
            <div className="header-right-item">
              <Link to="/cart" className="cart-link">CART (0)</Link>
            </div>
            <div className="header-right-item">
              <Link to="/search" className="search-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="search-icon" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 