import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [policies, setPolicies] = useState({ shippingPolicy: '', refundPolicy: '' });
  const [mainImage, setMainImage] = useState('');
  const carouselRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First try to fetch from regular products API
        let response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) {
          // If not found in regular products, try full marine setup API
          response = await fetch(`${API_BASE_URL}/api/full-marine-setup/${id}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Try to fetch related products from both APIs
        let relatedProductsData = [];
        
        // Fetch from regular products
        try {
          const response = await fetch(`${API_BASE_URL}/api/products`);
          if (response.ok) {
            const data = await response.json();
            relatedProductsData = relatedProductsData.concat(data.products);
          }
        } catch (err) {
          console.error('Failed to fetch regular products', err);
        }
        
        // Fetch from full marine setup products
        try {
          const response = await fetch(`${API_BASE_URL}/api/full-marine-setup`);
          if (response.ok) {
            const data = await response.json();
            relatedProductsData = relatedProductsData.concat(data.products);
          }
        } catch (err) {
          console.error('Failed to fetch full marine setup products', err);
        }
        
        // Filter out current product and limit to 4
        const filtered = relatedProductsData.filter(p => p._id !== product._id).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch related products', err);
      }
    };

    const fetchPolicies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/policies`);
        if (response.ok) {
          const data = await response.json();
          setPolicies(data);
        }
      } catch (err) {
        console.error('Failed to fetch policies', err);
      }
    };

    if (product) {
      // Set initial main image
      const initialImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
      setMainImage(initialImage);
      fetchRelated();
    }
    fetchPolicies();
  }, [product]);

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  // Helper function to get the main image for cart
  const getMainImageForCart = () => {
    return product.images && product.images.length > 0 ? product.images[0] : product.image;
  };

  useEffect(() => {
    if (relatedProducts.length > 0 && carouselRef.current && window.jQuery) {
      const $ = window.jQuery;
      if (!$(carouselRef.current).hasClass('owl-loaded')) {
        $(carouselRef.current).owlCarousel({
          nav: false,
          dots: true,
          margin: 20,
          loop: false,
          responsive: {
            0: { items: 1 },
            480: { items: 2 },
            768: { items: 3 },
            992: { items: 4 },
            1200: { items: 4, nav: true, dots: false }
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
  }, [relatedProducts]);

  useEffect(() => {
    // Initialize zoom functionality when product images are loaded
    if (product) {
      const mainImage = document.getElementById('product-zoom');
      const galleryButton = document.getElementById('btn-product-gallery');
      
      if (mainImage) {
        // Simple zoom functionality using CSS transform
        const handleMouseMove = (e) => {
          const rect = mainImage.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const xPercent = (x / rect.width) * 100;
          const yPercent = (y / rect.height) * 100;
          
          mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
          mainImage.style.transform = 'scale(2)';
        };

        const handleMouseLeave = () => {
          mainImage.style.transform = 'scale(1)';
          mainImage.style.transformOrigin = 'center center';
        };

        mainImage.addEventListener('mousemove', handleMouseMove);
        mainImage.addEventListener('mouseleave', handleMouseLeave);

        // Handle gallery image clicks for zoom
        const galleryItems = document.querySelectorAll('.product-gallery-item');
        galleryItems.forEach(item => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const newImage = item.getAttribute('data-image');
            mainImage.src = newImage;
            mainImage.setAttribute('data-zoom-image', newImage);
          });
        });

        // Handle gallery button click
        if (galleryButton) {
          galleryButton.addEventListener('click', (e) => {
            e.preventDefault();
            // This would typically open a modal gallery
            console.log('Opening product gallery modal for:', product.name);
          });
        }

        return () => {
          mainImage.removeEventListener('mousemove', handleMouseMove);
          mainImage.removeEventListener('mouseleave', handleMouseLeave);
          galleryItems.forEach(item => {
            item.removeEventListener('click', () => {});
          });
          if (galleryButton) {
            galleryButton.removeEventListener('click', () => {});
          }
        };
      }
    }
  }, [product]);

  if (loading) {
    return (
      <main className="main">
        <div className="container">
          <div className="text-center">
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main">
        <div className="container">
          <div className="text-center">
            <p>Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <nav aria-label="breadcrumb" className="breadcrumb-nav border-0 mb-0">
        <div className="container d-flex align-items-center">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item"><a href="#">Products</a></li>
            <li className="breadcrumb-item active" aria-current="page">Centered</li>
          </ol>
          <nav className="product-pager ml-auto" aria-label="Product">
            <a className="product-pager-link product-pager-prev" href="#" aria-label="Previous" tabIndex="-1">
              <i className="icon-angle-left"></i>
              <span>Prev</span>
            </a>
            <a className="product-pager-link product-pager-next" href="#" aria-label="Next" tabIndex="-1">
              <span>Next</span>
              <i className="icon-angle-right"></i>
            </a>
          </nav>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          <div className="product-details-top mb-2">
            <div className="row">
              <div className="col-md-6">
                <div className="product-gallery product-gallery-vertical">
                  <div className="row">
                  <figure className="product-main-image">
                    <img id="product-zoom" src={mainImage ? `${API_BASE_URL}${mainImage}` : (product.images && product.images.length > 0 ? `${API_BASE_URL}${product.images[0]}` : (product.image ? `${API_BASE_URL}${product.image}` : ''))} data-zoom-image={mainImage ? `${API_BASE_URL}${mainImage}` : (product.images && product.images.length > 0 ? `${API_BASE_URL}${product.images[0]}` : (product.image ? `${API_BASE_URL}${product.image}` : ''))} alt="product image" />
                    <a href="#" id="btn-product-gallery" className="btn-product-gallery" onClick={(e) => {
                      e.preventDefault();
                      // Open gallery modal or zoom functionality
                      console.log('Opening product gallery for:', product.name);
                      // This would typically trigger a modal or lightbox gallery
                      // For now, we'll just log the action
                    }}>
                      <i className="icon-arrows"></i>
                    </a>
                  </figure>
                  <div id="product-zoom-gallery" className="product-image-gallery">
                    {product.images && product.images.length > 0 ? (
                      product.images.map((img, index) => (
                        <a 
                          key={index} 
                          className={`product-gallery-item ${index === 0 ? 'active' : ''}`} 
                          href="#" 
                          data-image={`${API_BASE_URL}${img}`} 
                          data-zoom-image={`${API_BASE_URL}${img}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(img);
                          }}
                        >
                          <img src={`${API_BASE_URL}${img}`} alt={`product image ${index + 1}`} />
                        </a>
                      ))
                    ) : (
                      <a 
                        className="product-gallery-item active" 
                        href="#" 
                        data-image={product.image} 
                        data-zoom-image={product.image}
                        onClick={(e) => {
                          e.preventDefault();
                          handleImageClick(product.image);
                        }}
                      >
                        <img src={product.image ? `${API_BASE_URL}${product.image}` : ''} alt="product side" />
                      </a>
                    )}
                  </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="product-details product-details-centered">
                  <h1 className="product-title">{product.name}</h1>



                  <div className="product-price">
                    ₹{product.price}
                  </div>

                  <div className="product-content">
                    <p>{product.description}</p>
                    
                  </div>





                  <div className="product-details-action">
                    <div className="details-action-col">
                      <div className="product-details-quantity">
                        <input type="number" id="qty" className="form-control" value={quantity} onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.stock))} min="1" max={product.stock} step="1" data-decimals="0" required />
                      </div>
                      <a href="#" className="btn-product btn-cart" onClick={(e) => {
                        e.preventDefault();
                        // Create a cart-compatible product object
                        const cartProduct = {
                          ...product,
                          image: product.images && product.images.length > 0 ? product.images[0] : product.image
                        };
                        addToCart(cartProduct, quantity);
                      }}><span>add to cart</span></a>
                    </div>
                  </div>

                  <div className="product-details-footer">
                    <div className="product-cat">
                      <span>Category:</span>
                      <a href="#">{product.category?.name || 'Full Marine Setup'}</a>
                    </div>
                    <div className="social-icons social-icons-sm">
                      <span className="social-label">Share:</span>
                      <a href="#" className="social-icon" title="Facebook" target="_blank"><i className="icon-facebook-f"></i></a>
                      <a href="#" className="social-icon" title="Twitter" target="_blank"><i className="icon-twitter"></i></a>
                      <a href="#" className="social-icon" title="Instagram" target="_blank"><i className="icon-instagram"></i></a>
                      <a href="#" className="social-icon" title="Pinterest" target="_blank"><i className="icon-pinterest"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-details-tab">
            <ul className="nav nav-pills justify-content-center" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="product-desc-link" data-toggle="tab" href="#product-desc-tab" role="tab" aria-controls="product-desc-tab" aria-selected="true">Description</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="product-info-link" data-toggle="tab" href="#product-info-tab" role="tab" aria-controls="product-info-tab" aria-selected="false">Additional information</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="product-shipping-link" data-toggle="tab" href="#product-shipping-tab" role="tab" aria-controls="product-shipping-tab" aria-selected="false">Shipping & Returns</a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="product-desc-tab" role="tabpanel" aria-labelledby="product-desc-link">
                <div className="product-desc-content">
                  <h3>Product Information</h3>
                  <p>{product.description}</p>
                  
                </div>
              </div>
              <div className="tab-pane fade" id="product-info-tab" role="tabpanel" aria-labelledby="product-info-link">
                <div className="product-desc-content">
                  <h3>Additional Information</h3>
                  {product.additionalInfo ? (
                    <p>{product.additionalInfo}</p>
                  ) : (
                    <p>No additional information available for this product.</p>
                  )}
                </div>
              </div>
              <div className="tab-pane fade" id="product-shipping-tab" role="tabpanel" aria-labelledby="product-shipping-link">
                <div className="product-desc-content">
                  <div dangerouslySetInnerHTML={{ __html: policies.shippingPolicy }} />
                  <div dangerouslySetInnerHTML={{ __html: policies.refundPolicy }} />
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <>
              <h2 className="title text-center mb-4">You May Also Like</h2>
              <div className="owl-carousel owl-simple carousel-equal-height carousel-with-shadow" ref={carouselRef} data-toggle="owl"
                data-owl-options='{
                  "nav": false,
                  "dots": true,
                  "margin": 20,
                  "loop": false,
                  "responsive": {
                    "0": {
                      "items":1
                    },
                    "480": {
                      "items":2
                    },
                    "768": {
                      "items":3
                    },
                    "992": {
                      "items":4
                    },
                    "1200": {
                      "items":4,
                      "nav": true,
                      "dots": false
                    }
                  }
                }'>
                {relatedProducts.map(p => (
                  <div key={p._id} className="product product-7 text-center">
                    <figure className="product-media">
                      <a href={`/product/${p._id}`}>
                        <img src={p.images && p.images.length > 0 ? `${API_BASE_URL}${p.images[0]}` : (p.image ? `${API_BASE_URL}${p.image}` : '')} alt="Product image" className="product-image" />
                      </a>
                      <div className="product-action">
                        <a href="#" className="btn-product btn-cart" onClick={(e) => {
                          e.preventDefault();
                          // Create a cart-compatible product object for related products
                          const cartProduct = {
                            ...p,
                            image: p.images && p.images.length > 0 ? p.images[0] : p.image
                          };
                          addToCart(cartProduct, 1);
                        }}><span>add to cart</span></a>
                      </div>
                    </figure>
                    <div className="product-body">
                      <div className="product-cat">
                        <a href="#">{p.category?.name || 'Category'}</a>
                      </div>
                      <h3 className="product-title"><a href={`/product/${p._id}`}>{p.name}</a></h3>
                      <div className="product-price">
                        ₹{p.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
