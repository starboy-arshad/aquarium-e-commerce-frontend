import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';
import DOMPurify from 'dompurify';

const AccessoryPage = () => {
  const { id } = useParams();
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedAccessories, setRelatedAccessories] = useState([]);
  const [policies, setPolicies] = useState({ shippingPolicy: '', refundPolicy: '' });
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accessories/${id}`);
        if (!response.ok) {
          throw new Error('Accessory not found');
        }
        const data = await response.json();
        setAccessory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessory();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accessories`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current accessory and limit to 4
          const filtered = data.accessories.filter(a => a._id !== accessory._id).slice(0, 4);
          setRelatedAccessories(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch related accessories', err);
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

    if (accessory) {
      // Set initial main image
      const initialImage = accessory.images && accessory.images.length > 0 ? accessory.images[0] : accessory.image;
      setMainImage(initialImage);
      fetchRelated();
    }
    fetchPolicies();
  }, [accessory]);

  const handleImageClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  // Helper function to get the main image for cart
  const getMainImageForCart = () => {
    return accessory.images && accessory.images.length > 0 ? accessory.images[0] : accessory.image;
  };


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
            <li className="breadcrumb-item"><a href="/accessories">Accessories</a></li>
            <li className="breadcrumb-item active" aria-current="page">{accessory.name}</li>
          </ol>
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
                      <img id="product-zoom" src={mainImage ? (mainImage.startsWith('http') ? mainImage : `${API_BASE_URL}${mainImage.startsWith('/') ? '' : '/'}${mainImage.includes('uploads') ? '' : 'uploads/'}${mainImage}`) : '/assets/images/products/product-1.jpg'} data-zoom-image={mainImage ? (mainImage.startsWith('http') ? mainImage : `${API_BASE_URL}${mainImage.startsWith('/') ? '' : '/'}${mainImage.includes('uploads') ? '' : 'uploads/'}${mainImage}`) : '/assets/images/products/product-1.jpg'} alt="product image" />
                      <a href="#" id="btn-product-gallery" className="btn-product-gallery" onClick={(e) => {
                        e.preventDefault();
                        // Open gallery modal or zoom functionality
                        console.log('Opening accessory gallery for:', accessory.name);
                      }}>
                        <i className="icon-arrows"></i>
                      </a>
                    </figure>
                    <div id="product-zoom-gallery" className="product-image-gallery">
                      {accessory.images && accessory.images.length > 0 ? (
                        accessory.images.map((img, index) => (
                          <a
                            key={index}
                            className={`product-gallery-item ${index === 0 ? 'active' : ''}`}
                            href="#"
                            data-image={img.startsWith('http') ? img : `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img.includes('uploads') ? '' : 'uploads/'}${img}`}
                            data-zoom-image={img.startsWith('http') ? img : `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img.includes('uploads') ? '' : 'uploads/'}${img}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleImageClick(img);
                            }}
                          >
                            <img src={img.startsWith('http') ? img : `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img.includes('uploads') ? '' : 'uploads/'}${img}`} alt={`accessory image ${index + 1}`} />
                          </a>
                        ))
                      ) : (
                        <a
                          className="product-gallery-item active"
                          href="#"
                          data-image={accessory.image ? (accessory.image.startsWith('http') ? accessory.image : `${API_BASE_URL}${accessory.image.startsWith('/') ? '' : '/'}${accessory.image.includes('uploads') ? '' : 'uploads/'}${accessory.image}`) : '/assets/images/products/product-1.jpg'}
                          data-zoom-image={accessory.image ? (accessory.image.startsWith('http') ? accessory.image : `${API_BASE_URL}${accessory.image.startsWith('/') ? '' : '/'}${accessory.image.includes('uploads') ? '' : 'uploads/'}${accessory.image}`) : '/assets/images/products/product-1.jpg'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleImageClick(accessory.image);
                          }}
                        >
                          <img src={accessory.image ? (accessory.image.startsWith('http') ? accessory.image : `${API_BASE_URL}${accessory.image.startsWith('/') ? '' : '/'}${accessory.image.includes('uploads') ? '' : 'uploads/'}${accessory.image}`) : '/assets/images/products/product-1.jpg'} alt="accessory side" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="product-details product-details-centered">
                  <h1 className="product-title">{accessory.name}</h1>

                  <div className="product-price">
                    ₹{accessory.price}
                  </div>

                  <div className="product-content">
                    <p>{accessory.description}</p>
                  </div>

                  <div className="product-details-action">
                    <div className="details-action-col">
                      <div className="product-details-quantity">
                        <input type="number" id="qty" className="form-control" value={quantity} onChange={(e) => setQuantity(Math.min(Number(e.target.value), accessory.stock))} min="1" max={accessory.stock} step="1" data-decimals="0" required />
                      </div>
                      <a href="#" className="btn-product btn-cart" onClick={(e) => {
                        e.preventDefault();
                        // Create a cart-compatible accessory object
                        const cartAccessory = {
                          ...accessory,
                          image: accessory.images && accessory.images.length > 0 ? accessory.images[0] : accessory.image
                        };
                        addToCart(cartAccessory, quantity);
                      }}><span>add to cart</span></a>
                    </div>
                  </div>

                  <div className="product-details-footer">
                    <div className="product-cat">
                      <span>Category:</span>
                      <a href="#">{accessory.category?.name || 'Accessories'}</a>
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
                  <p>{accessory.description}</p>
                </div>
              </div>
              <div className="tab-pane fade" id="product-info-tab" role="tabpanel" aria-labelledby="product-info-link">
                <div className="product-desc-content">
                  <h3>Additional Information</h3>
                  {accessory.additionalInfo ? (
                    <p>{accessory.additionalInfo}</p>
                  ) : (
                    <p>No additional information available for this accessory.</p>
                  )}
                </div>
              </div>
              <div className="tab-pane fade" id="product-shipping-tab" role="tabpanel" aria-labelledby="product-shipping-link">
                <div className="product-desc-content">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.shippingPolicy) }} />
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.refundPolicy) }} />
                </div>
              </div>
            </div>
          </div>

          {relatedAccessories.length > 0 && (
            <>
              <h2 className="title text-center mb-4">You May Also Like</h2>
              <div className="owl-carousel owl-simple carousel-equal-height carousel-with-shadow" data-toggle="owl"
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
                {relatedAccessories.map(a => (
                  <div key={a._id} className="product product-7 text-center">
                    <figure className="product-media">
                      <a href={`/accessory/${a._id}`}>
                        <img src={a.images && a.images.length > 0 ? `${API_BASE_URL}${a.images[0]}` : (a.image ? `${API_BASE_URL}${a.image}` : '')} alt="Product image" className="product-image" />
                      </a>
                      <div className="product-action">
                        <a href="#" className="btn-product btn-cart" onClick={(e) => {
                          e.preventDefault();
                          // Create a cart-compatible accessory object for related accessories
                          const cartAccessory = {
                            ...a,
                            image: a.images && a.images.length > 0 ? a.images[0] : a.image
                          };
                          addToCart(cartAccessory, 1);
                        }}><span>add to cart</span></a>
                      </div>
                    </figure>
                    <div className="product-body">
                      <div className="product-cat">
                        <a href="#">{a.category?.name || 'Accessories'}</a>
                      </div>
                      <h3 className="product-title"><a href={`/accessory/${a._id}`}>{a.name}</a></h3>
                      <div className="product-price">
                        ₹{a.price}
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

export default AccessoryPage;