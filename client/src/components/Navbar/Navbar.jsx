import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          Bookstore
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Books
          </Link>
          <Link to="/shop/listing" className="nav-link">
            Shop
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 