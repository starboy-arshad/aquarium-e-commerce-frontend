import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';

const FullMarineSetupPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState('popularity');
  const [gridColumns, setGridColumns] = useState(4);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        pageNumber: page,
        sortBy: sortBy,
      });

      const response = await fetch(`${API_BASE_URL}/api/full-marine-setup?${params}`);
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

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
          <h1 className="page-title" style={{ color: 'white' }}>Full Marine Setup<span>Products</span></h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-2">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Full Marine Setup</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
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
              {(() => {
                const colClass = gridColumns === 2 ? "col-6 col-md-6 col-lg-6 col-xl-6" :
                  gridColumns === 3 ? "col-6 col-md-4 col-lg-4 col-xl-4" :
                    "col-6 col-md-4 col-lg-4 col-xl-3";
                return products.map((product) => (
                  <div key={product._id} className={colClass}>
                    <div className="product product-7 text-center">
                      <figure className="product-media">
                        <Link to={`/product/${product._id}`}>
                          <img src={product.images && product.images.length > 0 ? `${API_BASE_URL}${product.images[0]}` : (product.image ? `${API_BASE_URL}${product.image}` : '')} alt={product.name} className="product-image" />
                        </Link>

                        <div className="product-action">
                          <button
                            className="btn-product btn-cart"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('Adding to cart:', product);
                              addToCart(product, 1);
                            }}
                          >
                            <span>add to cart</span>
                          </button>
                        </div>
                      </figure>
                      <div className="product-body">
                        <div className="product-cat">
                          <a href="#">Full Marine Setup</a>
                        </div>
                        <h3 className="product-title"><Link to={`/product/${product._id}`}>{product.name}</Link></h3>
                        <div className="product-price">
                          ₹{product.price}
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
      </div>
    </main>
  );
};

export default FullMarineSetupPage;
