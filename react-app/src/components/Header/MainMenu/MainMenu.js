import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';
import { MAIN_MENU_QUERY } from './MainMenuQuery.js';
import { useQuery } from '@apollo/client';

export default function MainMenu() {
    const { loading, error, data } = useQuery(MAIN_MENU_QUERY, {});
    console.log('data', data);
    console.log('error', error);
    console.log('loading', loading);
    
    // Only set menuItems if data and data.menu exist
    const menuItems = data?.menu?.items || [];
    
    // Show loading state
    if (loading) {
      return <div className="nav-menu">Loading menu...</div>;
    }
    
    // Handle errors
    if (error) {
      console.error('Error loading menu:', error);
      return <div className="nav-menu">Error loading menu</div>;
    }
    
    return (
      <nav className="nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link to={item.url}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    )
}