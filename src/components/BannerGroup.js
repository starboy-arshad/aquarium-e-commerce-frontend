import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const BannerGroup = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current && window.jQuery) {
      const $ = window.jQuery;
      if (!$(carouselRef.current).hasClass('owl-loaded')) {
        $(carouselRef.current).owlCarousel({
          nav: false,
          dots: true,
          margin: 10,
          loop: false,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            992: { items: 3 }
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
  }, []);

  return (
    <div className="banner-group-3 mt-3 mb-1">
      <div className="container">
        <div className="owl-carousel owl-simple rows cols-1 cols-sm-2 cols-lg-3" ref={carouselRef} data-toggle="owl" data-owl-options='{
          "nav": false,
          "dots": true,
          "margin": 10,
          "loop": false,
          "responsive": {
            "0": {
              "items":1
            },
            "576": {
              "items":2
            },
            "992": {
              "items":3
            }
          }
        }'>
          <div className="banner mb-0">
            <a href="/shop">
              <img src={`${process.env.PUBLIC_URL}/assets/card1.jpg`} width="460" height="210" alt="Fresh Fruit" />
            </a>
            <div className="banner-content p-3">
              <h5 className="banner-subtitle font-weight-normal text-white mb-1">Live Aquarium Fish</h5>
              <h3 className="banner-title font-weight-bold text-white">Healthy & Colorful <br />Fishes</h3>
              <Link to="/shop" className="banner-link text-decoration-none text-white">Shop Now<i className="icon-angle-right"></i></Link>
            </div>
          </div>
          <div className="banner mb-0">
            <a href="/accessories">
              <img src={`${process.env.PUBLIC_URL}/assets/card2.jpg`} width="460" height="210" alt="Our Standards" />
            </a>
            <div className="banner-content p-3">
              <h5 className="banner-subtitle font-weight-normal text-white mb-1">Aquarium Essentials</h5>
              <h3 className="banner-title font-weight-bold text-white">Fish Tank Accessories<br />Filters • Lights • Decor</h3>
              <Link to="/accessories" className="banner-link text-decoration-none text-white">Shop Accessories<i className="icon-angle-right"></i></Link>
            </div>
          </div>
          <div className="banner mb-0">
            <a href="/full-marine-setup">
              <img src={`${process.env.PUBLIC_URL}/assets/card3.png`} width="460" height="210" alt="Diet Products" />
            </a>
            <div className="banner-content p-3">
              <h5 className="banner-subtitle font-weight-normal text-white mb-1">Complete Aquarium</h5>
              <h3 className="banner-title font-weight-bold text-white">Full Fish Tank Setup<br />Tank • Filter• Lights  </h3>
              <Link to="/full-marine-setup" className="banner-link text-decoration-none text-white">View Setups<i className="icon-angle-right"></i></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerGroup;
