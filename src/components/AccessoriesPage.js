import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';

const AccessoriesPage = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [accessories, setAccessories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [gridColumns, setGridColumns] = useState(4);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory([decodeURIComponent(category)]);
    }
  }, [location.search]);

  useEffect(() => {
    fetchAccessories();
  }, [page, selectedCategory, priceRange]);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: page,
      });
      if (selectedCategory.length > 0) {
        selectedCategory.forEach(cat => params.append('category', cat));
      }

      const response = await fetch(`${API_BASE_URL}/api/accessories?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch accessories');
      }
      const data = await response.json();
      setAccessories(data.accessories);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/accessories/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };



  const handleCategoryChange = (category) => {
    setSelectedCategory(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory([]);
    setPriceRange([0, 200]);
    setPage(1);
  };

  const handleGridChange = (columns) => {
    setGridColumns(columns);
  };

  if (loading) {
    return (
      <main className="main">
        <div className="container">
          <div className="text-center mt-5">Loading accessories...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main">
        <div className="container">
          <div className="text-center mt-5">Error: {error}</div>
        </div>
      </main>
    );
  }

  if (accessories.length === 0) {
    return (
      <main className="main">
        <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container">
            <h1 className="page-title" style={{ color: 'white' }}>Accessories<span>Shop</span></h1>
          </div>
        </div>

        <nav aria-label="breadcrumb" className="breadcrumb-nav mb-2">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Accessories</li>
            </ol>
          </div>
        </nav>

        <div className="page-content">
          <div className="container">
            <div className="text-center">
              <div className="coming-soon-message">
                <h2>Coming Soon</h2>
                <p>We're working on adding exciting new accessories to our collection. Check back soon!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="page-title" style={{ color: 'white' }}>Accessories<span>Shop</span></h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-2">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Accessories</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-9">
              <div className="toolbox">
                <div className="toolbox-left">
                  <div className="toolbox-info">
                    Showing <span>{accessories.length} of {pages * 10}</span> Accessories
                  </div>
                </div>

                <div className="toolbox-right">
                  <div className="toolbox-layout">
                    <a href="#" className={`btn-layout ${gridColumns === 4 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleGridChange(4); }}>
                      <svg width="22" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="12" y="0" width="4" height="4" />
                        <rect x="18" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                        <rect x="12" y="6" width="4" height="4" />
                        <rect x="18" y="6" width="4" height="4" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="products mb-3">
                <div className="row justify-content-center">
                  {(() => {
                    const colClass = "col-6 col-md-4 col-lg-4 col-xl-3";
                    const getProductImage = (accessory) => {
                      const img = (accessory.images && accessory.images.length > 0) ? accessory.images[0] : accessory.image;
                      if (!img) return '/assets/images/products/product-1.jpg';
                      if (img.startsWith('http')) return img;

                      const cleanImg = img.startsWith('/') ? img.substring(1) : img;
                      const finalPath = cleanImg.startsWith('uploads/') ? cleanImg : `uploads/${cleanImg}`;
                      return `${API_BASE_URL}/${finalPath}`;
                    };

                    return accessories.map((accessory) => (
                      <div key={accessory._id} className={colClass}>
                        <div className="product product-7 text-center">
                          <figure className="product-media">
                            <Link to={`/accessory/${accessory._id}`}>
                              <img src={getProductImage(accessory)} alt={accessory.name} className="product-image" />
                            </Link>
                            <div className="product-action-vertical">
                              <a href="#" className="btn-product-icon btn-wishlist btn-expandable"><span>add to wishlist</span></a>
                              <a href="#" className="btn-product-icon btn-quickview" title="Quick view"><span>Quick view</span></a>
                              <a href="#" className="btn-product-icon btn-compare" title="Compare"><span>Compare</span></a>
                            </div>
                            <div className="product-action">
                              <a href="#" className="btn-product btn-cart" onClick={(e) => {
                                e.preventDefault();
                                // Create a cart-compatible accessory object
                                const cartAccessory = {
                                  ...accessory,
                                  image: accessory.images && accessory.images.length > 0 ? accessory.images[0] : accessory.image
                                };
                                addToCart(cartAccessory);
                              }}><span>add to cart</span></a>
                            </div>
                          </figure>
                          <div className="product-body">
                            <div className="product-cat">
                              <a href="#">{accessory.category?.name}</a>
                            </div>
                            <h3 className="product-title"><Link to={`/accessory/${accessory._id}`}>{accessory.name}</Link></h3>
                            <div className="product-price">
                              ₹{accessory.price}
                            </div>
                            <div className="product-stock">
                              Stock: {accessory.stock}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className="page-link page-link-prev" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                      <span aria-hidden="true"><i className="icon-long-arrow-left"></i></span>Prev
                    </button>
                  </li>
                  {[...Array(pages).keys()].map((x) => (
                    <li key={x + 1} className={`page-item ${x + 1 === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(x + 1)}>{x + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                    <button className="page-link page-link-next" onClick={() => handlePageChange(page + 1)} disabled={page === pages}>
                      Next <span aria-hidden="true"><i className="icon-long-arrow-right"></i></span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <aside className="col-lg-3 order-lg-first">
              <div className="sidebar sidebar-shop">
                <div className="widget widget-clean">
                  <label>Filters:</label>
                  <a href="#" className="sidebar-filter-clear" onClick={clearAllFilters}>Clean All</a>
                </div>

                <div className="widget widget-collapsible">
                  <h3 className="widget-title">
                    <a data-toggle="collapse" href="#widget-1" role="button" aria-expanded="true" aria-controls="widget-1">
                      Category
                    </a>
                  </h3>
                  <div className="collapse show" id="widget-1">
                    <div className="widget-body">
                      <div className="filter-items filter-items-count">
                        {categories.map((category) => (
                          <div key={category.name} className="filter-item">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={`cat-${category.name}`}
                                checked={selectedCategory.includes(category.name)}
                                onChange={() => handleCategoryChange(category.name)}
                              />
                              <label className="custom-control-label" htmlFor={`cat-${category.name}`}>{category.name}</label>
                            </div>
                            <span className="item-count">{category.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="widget widget-collapsible">
                  <h3 className="widget-title">
                    <a data-toggle="collapse" href="#widget-5" role="button" aria-expanded="true" aria-controls="widget-5">
                      Price
                    </a>
                  </h3>
                  <div className="collapse show" id="widget-5">
                    <div className="widget-body">
                      <div className="filter-price">
                        <div className="filter-price-text">
                          Price Range: <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
                        </div>
                        <div className="price-slider">
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                          />
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccessoriesPage;
