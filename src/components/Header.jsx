import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import './Header.css';

const Header = () => {
  const { cartItems, getCartTotal, getCartItemsCount, removeFromCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('API Error fetching categories:', data);
          setCategories([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mmenu-active');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('mmenu-active');
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveMobileMenu(null);
  };

  const toggleMobileSubmenu = (menuName) => {
    if (activeMobileMenu === menuName) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(menuName);
    }
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
  };

  return (
    <header className="header header-28 bg-transparent">




      <div className="sticky-wrapper">
        <div className="header-middle sticky-header" style={{ marginBottom: '20px' }}>
          <div className="container">
            <div className="header-left">
              <button
                className="mobile-menu-toggler"
                onClick={toggleMobileMenu}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                <i className="icon-bars"></i>
              </button>

              <Link to="/" className="logo">
                <img src="/assets/images/erode_marine.jpg" alt="Aquarium Shop Logo" width="70" height="25" />
              </Link>

              <nav className="main-nav">
                <ul className="menu sf-arrows">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/shop">Shop all products</Link></li>
                  <li className="megamenu-list">
                    <a href="#" className="sf-with-ul">Livestock</a>
                    <div className="megamenu megamenu-md">
                      <div className="row no-gutters">
                        <div className="col-md-12">
                          <div className="menu-col">
                            <div className="row">
                              {loading ? (
                                <div className="col-12 text-center">Loading categories...</div>
                              ) : (
                                <>
                                  <div className="col-md-6">
                                    <div className="menu-title">Categories</div>
                                    <ul>
                                      {(Array.isArray(categories) ? categories : []).slice(0, Math.ceil((Array.isArray(categories) ? categories.length : 0) / 2)).map(category => (
                                        <li key={category._id}>
                                          <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
                                            {category.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="menu-title">&nbsp;</div>
                                    <ul>
                                      {(Array.isArray(categories) ? categories : []).slice(Math.ceil((Array.isArray(categories) ? categories.length : 0) / 2)).map(category => (
                                        <li key={category._id}>
                                          <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
                                            {category.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li><Link to="/full-marine-setup">Full Marine Setup</Link></li>
                  <li><Link to="/accessories">Accessories</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  {user && user.isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
                </ul>
              </nav>
            </div>

            <div className="header-right">
              <div className="header-search">
                <a
                  href="#"
                  className="search-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchOpen(!searchOpen);
                  }}
                  style={{ fontSize: '24px' }}
                >
                  <i className="icon-search"></i>
                </a>
                <form onSubmit={handleSearchSubmit}>
                  <div className={`header-search-wrapper ${searchOpen ? 'show' : ''}`}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="icon-search"></i>
                    </button>
                  </div>
                </form>
              </div>

              <div className="icon position-relative" style={{ marginRight: '15px' }}>
                <Link to="/account">
                  <i className="icon-user" style={{ fontSize: '24px' }}></i>
                </Link>
              </div>

              <div className="dropdown cart-dropdown">
                <Link to="/cart" className="dropdown-toggle">
                  <div className="icon position-relative">
                    <i className="icon-shopping-cart" style={{ fontSize: '24px' }}></i>
                    <span className="cart-count">{getCartItemsCount()}</span>
                  </div>
                  <span className="cart-txt font-weight-normal">₹{getCartTotal().toFixed(2)}</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="dropdown-cart-products">
                    {cartItems.length === 0 ? (
                      <p className="text-center p-3">Your cart is empty</p>
                    ) : (
                      cartItems.map(item => (
                        <div key={item.id} className="product">
                          <div className="product-cart-details">
                            <h4 className="product-title">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h4>
                            <span className="cart-product-info">
                              <span className="cart-product-qty">{item.quantity}</span>
                              x ₹{item.price.toFixed(2)}
                            </span>
                          </div>
                          <figure className="product-image-container">
                            <Link to={`/product/${item.id}`} className="product-image">
                              <img src={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${(item.image.startsWith('/') ? item.image.substring(1) : item.image).startsWith('uploads/') ? (item.image.startsWith('/') ? item.image.substring(1) : item.image) : `uploads/${(item.image.startsWith('/') ? item.image.substring(1) : item.image)}`}`) : '/assets/images/products/product-1.jpg'} alt="product" />
                            </Link>
                          </figure>
                          <a
                            href="#"
                            className="btn-remove"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFromCart(item.id);
                            }}
                          >
                            <i className="icon-close"></i>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <>
                      <div className="dropdown-cart-total">
                        <span>Total</span>
                        <span className="cart-total-price">₹{getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="dropdown-cart-action">
                        <Link to="/cart" className="btn btn-primary">View Cart</Link>
                        <Link to="/checkout" className="btn btn-outline-primary-2">
                          <span>Checkout</span><i className="icon-long-arrow-right"></i>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-container ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-wrapper">
          <div className="mobile-nav">
            <ul className="mobile-menu">
              <li>
                <Link to="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li>
                <Link to="/shop" onClick={closeMobileMenu}>Shop all products</Link>
              </li>
              <li className={`megamenu-list ${activeMobileMenu === 'livestock' ? 'active' : ''}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMobileSubmenu('livestock');
                  }}
                >
                  Livestock
                </a>
                <ul>
                  {loading ? (
                    <li>Loading categories...</li>
                  ) : (
                    (Array.isArray(categories) ? categories : []).map(category => (
                      <li key={category._id}>
                        <Link
                          to={`/shop?category=${encodeURIComponent(category.name)}`}
                          onClick={closeMobileMenu}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </li>
              <li>
                <Link to="/full-marine-setup" onClick={closeMobileMenu}>Full Marine Setup</Link>
              </li>
              <li>
                <Link to="/accessories" onClick={closeMobileMenu}>Accessories</Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>
              </li>
              {user && user.isAdmin && (
                <li>
                  <Link to="/admin" onClick={closeMobileMenu}>Admin Panel</Link>
                </li>
              )}

              {/* Mobile-only menu items */}
              <li className="separator"></li>

              <li>
                {user ? (
                  <a href="#" onClick={handleLogout}>
                    <i className="icon-user" style={{ marginRight: '10px' }}></i>
                    Logout ({user.name || user.email})
                  </a>
                ) : (
                  <Link to="/login" onClick={closeMobileMenu}>
                    <i className="icon-user" style={{ marginRight: '10px' }}></i>
                    Login / Register
                  </Link>
                )}
              </li>

              <li>
                <Link to="/account" onClick={closeMobileMenu}>
                  <i className="icon-cog" style={{ marginRight: '10px' }}></i>
                  My Account
                </Link>
              </li>

              <li>
                <Link to="/cart" onClick={closeMobileMenu}>
                  <i className="icon-shopping-cart" style={{ marginRight: '10px' }}></i>
                  Shopping Cart ({getCartItemsCount()})
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <button className="mobile-menu-close" onClick={closeMobileMenu}>
          <i className="icon-close"></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>
    </header>
  );
};

export default Header;