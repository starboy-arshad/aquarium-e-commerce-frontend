import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <hr className="m-0" />
        <div className="cat-section mt-4 mb-3">
          <h2 className="cat-section-title">Product Categories</h2>
          <div className="text-center">Loading categories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <hr className="m-0" />
        <div className="cat-section mt-4 mb-3">
          <h2 className="cat-section-title">Product Categories</h2>
          <div className="text-center text-danger">Error loading categories: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <hr className="m-0" />
      <div className="cat-section mt-4 mb-3">
        <h2 className="cat-section-title">Product Categories</h2>
        <div className="row">
          {categories.map((category, index) => (
            <div key={category._id} className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-8col">
            <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="cat bg-white pt-1 mb-2">
                <div className="cat-image d-flex justify-content-center align-items-center">
                  <img src={category.image ? `${process.env.PUBLIC_URL}/assets/images/categories/${category.image}` : `${process.env.PUBLIC_URL}/assets/images/demos/demo-28/categories/${index + 1}.jpg`} width="137" height="137" alt={category.name} />
                </div>
                <div className="cat-content text-center">
                  <div className="cat-title">{category.name}</div>
                  <h4 className="cat-count letter-spacing-normal d-block font-weight-light">{category.productCount} Products</h4>
                </div>
              </Link>
            </div>
          ))}
          <div className="col-6 col-sm-4 col-md-3 col-lg-2 col-xl-8col">
            <Link to="/shop" className="cat bg-white pt-1 mb-2">
              <div className="cat-image d-flex justify-content-center align-items-center">
                <img src={`${process.env.PUBLIC_URL}/assets/images/demos/demo-28/categories/6.jpg`} width="137" height="137" alt="View All" />
              </div>
              <div className="cat-content text-center">
                <div className="cat-title">View All</div>
                <h4 className="cat-count letter-spacing-normal d-block font-weight-light">Products</h4>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
