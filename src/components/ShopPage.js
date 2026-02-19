import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';

const ShopPage = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [keyword, setKeyword] = useState('');

  const [priceRange, setPriceRange] = useState([0, 200]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 200]);
  const [gridColumns, setGridColumns] = useState(4);
  const [imageLoadStates, setImageLoadStates] = useState({});

  // Helper function to get properly formatted image URL
  const getProductImage = (img) => {
    if (!img) return '/assets/images/products/product-1.jpg';
    if (img.startsWith('http')) return img;

    // Handle different image path formats
    let cleanImg = img;
    if (img.startsWith('/')) {
      cleanImg = img.substring(1);
    }
    
    // If the image already has uploads/ prefix, use it as is
    if (cleanImg.startsWith('uploads/')) {
      return `${API_BASE_URL}/${cleanImg}`;
    } else {
      // For images without uploads/ prefix, add it
      return `${API_BASE_URL}/uploads/${cleanImg}`;
    }
  };

  // Debug function to log image URLs
  const debugImageURL = (img, productName) => {
    const url = getProductImage(img);
    console.log(`Product: ${productName}, Image: ${img}, URL: ${url}`);
    return url;
  };

  // Handle image load error
  const handleImageError = (productId, imageType) => {
    setImageLoadStates(prev => ({
      ...prev,
      [`${productId}-${imageType}`]: 'error'
    }));
  };

  // Handle image load success
  const handleImageLoad = (productId, imageType) => {
    setImageLoadStates(prev => ({
      ...prev,
      [`${productId}-${imageType}`]: 'loaded'
    }));
  };

  // Memoize the column class calculation to prevent unnecessary re-renders
  const colClass = useMemo(() => {
    return gridColumns === 2 ? "col-6 col-md-6 col-lg-6 col-xl-6" :
      gridColumns === 3 ? "col-6 col-md-4 col-lg-4 col-xl-4" :
        "col-6 col-md-4 col-lg-4 col-xl-3";
  }, [gridColumns]);

  // Memoize the product list rendering to prevent unnecessary re-renders
  const productCards = useMemo(() => {
    return products.map((product) => {
      const rawImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
      const productImage = debugImageURL(rawImage, product.name);
      const imageLoadState = imageLoadStates[`${product._id}-main`];
      const hasError = imageLoadState === 'error';
      
      return (
        <div key={product._id} className={colClass}>
          <div className="product product-7 text-center">
            <figure className="product-media">
              <Link to={`/product/${product._id}`}>
                <img
                  src={hasError ? '/assets/images/products/product-1.jpg' : productImage}
                  alt={product.name}
                  className="product-image"
                  onLoad={() => handleImageLoad(product._id, 'main')}
                  onError={() => handleImageError(product._id, 'main')}
                  style={{
                    opacity: imageLoadState === 'loaded' ? 1 : (hasError ? 1 : 0),
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              </Link>

              <div className="product-action">
                <button className="btn-product btn-cart" onClick={() => {
                  // Create a cart-compatible product object
                  const cartProduct = {
                    ...product,
                    image: product.images && product.images.length > 0 ? product.images[0] : product.image
                  };
                  addToCart(cartProduct);
                }}>
                  <span>add to cart</span>
                </button>
              </div>
            </figure>
            <div className="product-body">
              <div className="product-cat">
                <a href="#">{product.category?.name}</a>
              </div>
              <h3 className="product-title"><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
              <div className="product-price">
                ₹{product.price}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [products, colClass, imageLoadStates, addToCart, getProductImage, handleImageLoad, handleImageError]);




  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const kw = params.get('q');
    if (category) {
      setSelectedCategory([decodeURIComponent(category)]);
    } else {
      setSelectedCategory([]);
    }
    if (kw) {
      setKeyword(decodeURIComponent(kw));
    } else {
      setKeyword('');
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, selectedCategory, priceRange, keyword]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: page,
        sortBy: sortBy,
      });
      if (keyword) {
        params.append('keyword', keyword);
      }
      if (selectedCategory.length > 0) {
        selectedCategory.forEach(cat => params.append('category', cat));
      }
      if (priceRange[0] > 0) {
        params.append('minPrice', priceRange[0]);
      }
      if (priceRange[1] > 0 && priceRange[1] !== 200) {
        params.append('maxPrice', priceRange[1]);
      }

      const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      // Add Full Marine Setup as a special category
      const categoriesWithFullMarine = [...data, { name: 'Full Marine Setup', count: 0 }];
      setCategories(categoriesWithFullMarine);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
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
    setTempPriceRange([min, max]);
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory([]);
    setPriceRange([0, 200]);
    setKeyword('');
    setPage(1);
  };

  const handleGridChange = (columns) => {
    setGridColumns(columns);
  };

  if (loading) {
    return (
      <main className="main">
        <div className="container">
          <div className="text-center mt-5">Loading products...</div>
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

  return (
    <main className="main">
      <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="page-title" style={{ color: 'white' }}>Shop<span>products</span></h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-2">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Shop</li>
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
                    Showing <span>{products.length} of {pages * 10}</span> Products
                  </div>
                </div>

                <div className="toolbox-right">
                  <div className="toolbox-sort">
                    <label htmlFor="sortby">Sort by:</label>
                    <div className="select-custom">
                      <select name="sortby" id="sortby" className="form-control" value={sortBy} onChange={handleSortChange}>
                        <option value="popularity">Most Popular</option>
                        <option value="rating">Most Rated</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                  </div>
                  <div className="toolbox-layout">
                    <a href="#" className={`btn-layout ${gridColumns === 2 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleGridChange(2); }}>
                      <svg width="16" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="10" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="10" height="4" />
                      </svg>
                    </a>
                    <a href="#" className={`btn-layout ${gridColumns === 2 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleGridChange(2); }}>
                      <svg width="10" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                      </svg>
                    </a>
                    <a href="#" className={`btn-layout ${gridColumns === 3 ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleGridChange(3); }}>
                      <svg width="16" height="10">
                        <rect x="0" y="0" width="4" height="4" />
                        <rect x="6" y="0" width="4" height="4" />
                        <rect x="12" y="0" width="4" height="4" />
                        <rect x="0" y="6" width="4" height="4" />
                        <rect x="6" y="6" width="4" height="4" />
                        <rect x="12" y="6" width="4" height="4" />
                      </svg>
                    </a>
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
                  {productCards}
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
                    <a data-toggle="collapse" href="#widget-2" role="button" aria-expanded="true" aria-controls="widget-2">
                      Price
                    </a>
                  </h3>
                  <div className="collapse show" id="widget-2">
                    <div className="widget-body">
                      <div className="filter-price">
                        <div className="filter-price-text">
                          Price Range: <span>₹{priceRange[0]} - ₹{priceRange[1]}</span>
                        </div>
                        <div className="price-inputs">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Min</span>
                            </div>
                            <input
                              type="number"
                              className="form-control"
                              min="0"
                              max="10000"
                              value={tempPriceRange[0]}
                              onChange={(e) => handlePriceChange(parseInt(e.target.value), tempPriceRange[1])}
                            />
                          </div><br/>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Max</span>
                            </div>
                            <input
                              type="number"
                              className="form-control"
                              min="0"
                              max="10000"
                              value={tempPriceRange[1]}
                              onChange={(e) => handlePriceChange(tempPriceRange[0], parseInt(e.target.value))}
                            />
                          </div>
                        </div><br/>
                        <div className="apply-filter-container">
                          <button className="btn btn-primary btn-block" onClick={applyPriceFilter}>
                            Apply Filter
                          </button>
                          <button className="btn btn-secondary btn-block mt-2" onClick={() => {
                            setTempPriceRange([0, 200]);
                            setPriceRange([0, 200]);
                            setPage(1);
                          }}>
                            Reset Filter
                          </button>
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

export default ShopPage;
