import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="header-content">
          <div className="header-left">
            <Link to="/">ChicNest</Link>
          </div>
          <nav className="nav-menu">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
          <div className="header-right">
            <div className="header-right-item">
              <Link to="/login">Login</Link>
            </div>
            <div className="header-right-item">
              <Link to="/register">Register</Link>
            </div>
            <div className="header-right-item">
              <Link to="/cart">Cart</Link>
            </div>
            <div className="header-right-item">
              <Link to="/search">Search</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 