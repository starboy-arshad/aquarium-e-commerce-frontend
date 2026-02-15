import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        // Fallback to dummy data for testing
        setCategories([
          { _id: '1', name: 'Fish', productCount: 10 },
          { _id: '2', name: 'Plants', productCount: 5 },
          { _id: '3', name: 'Decorations', productCount: 8 },
          { _id: '4', name: 'Filters', productCount: 12 },
          { _id: '5', name: 'Lights', productCount: 6 },
          { _id: '6', name: 'Heaters', productCount: 4 },
          { _id: '7', name: 'Substrates', productCount: 9 },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (carouselRef.current && window.jQuery && categories.length > 0) {
      const $ = window.jQuery;
      if (!$(carouselRef.current).hasClass('owl-loaded')) {
        $(carouselRef.current).owlCarousel({
          nav: true,
          dots: false,
          margin: 20,
          loop: false,
          responsive: {
            0: { items: 2 },
            480: { items: 3 },
            768: { items: 4 },
            992: { items: 5 },
            1200: { items: 6 }
          }
        });
      }
    }

    return () => {
      if (carouselRef.current && window.jQuery) {
        const $ = window.jQuery;
        $(carouselRef.current).trigger('destroy.owl.carousel');
      }
    };
  }, [categories]);

  if (loading) {
    return <div className="container">Loading categories...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (categories.length === 0) {
    return <div className="container">No categories found.</div>;
  }

  return (
    <div className="container">
      <hr className="m-0" />
      <div className="cat-section mt-4 mb-3">
        <h2 className="cat-section-title">All Categories</h2>
        <div className="owl-carousel owl-simple carousel-equal-height carousel-with-shadow" ref={carouselRef}>
          {categories.map((category, index) => {
            const imageSrc = category.image
              ? (category.image.startsWith('http') ? category.image : `${API_BASE_URL}/${(category.image.startsWith('/') ? category.image.substring(1) : category.image).startsWith('uploads/') ? (category.image.startsWith('/') ? category.image.substring(1) : category.image) : `uploads/${(category.image.startsWith('/') ? category.image.substring(1) : category.image)}`}`)
              : `${process.env.PUBLIC_URL}/assets/images/demos/demo-28/categories/${index + 1}.jpg`;

            return (
              <div key={category.name} className="cat bg-white pt-1 mb-2">
                <div className="cat-image d-flex justify-content-center align-items-center">
                  <Link to={`/shop?category=${encodeURIComponent(category.name)}`}>
                    <img src={imageSrc} width="137" height="137" alt={category.name} />
                  </Link>
                </div>
                <div className="cat-content text-center">
                  <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="cat-title">
                    {category.name}
                  </Link>
                  <h4 className="cat-count letter-spacing-normal d-block font-weight-light">{category.productCount || 0} Products</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
