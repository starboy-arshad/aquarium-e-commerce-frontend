import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const carouselRef = useRef(null);
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    if (initializedRef.current) return; // Prevent multiple initializations

    const initializeCarousel = () => {
      if (carouselRef.current && window.jQuery) {
        const $ = window.jQuery;
        if ($(carouselRef.current).hasClass('owl-loaded')) {
          $(carouselRef.current).trigger('destroy.owl.carousel');
        }
        $(carouselRef.current).owlCarousel({
          nav: false,
          dots: true,
          loop: false
        });
        // Refresh the carousel to ensure proper sizing
        $(carouselRef.current).trigger('refresh.owl.carousel');
      }
    };

    const handleLoad = () => {
      initializeCarousel();
    };

    const handleResize = () => {
      if (carouselRef.current && window.jQuery) {
        const $ = window.jQuery;
        $(carouselRef.current).trigger('refresh.owl.carousel');
      }
    };

    const videoElement = carouselRef.current?.querySelector('video');
    if (videoElement) {
      videoElement.addEventListener('loadeddata', initializeCarousel);
    }

    if (document.readyState === 'complete') {
      initializeCarousel();
    } else {
      window.addEventListener('load', handleLoad);
    }

    window.addEventListener('resize', handleResize);

    initializedRef.current = true; // Mark as initialized

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadeddata', initializeCarousel);
      }
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      if (carouselRef.current && window.jQuery) {
        const $ = window.jQuery;
        $(carouselRef.current).trigger('destroy.owl.carousel');
      }
    };
  }, []);

  return (
    <div className="intro-section bg-image" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/demos/demo-28/background.jpg)`, backgroundSize: 'cover'}}>
      <div className="container-fluid p-0">
        <div id="hero-carousel" className="owl-carousel inner-carousel owl-simple rows cols-1" ref={carouselRef} style={{width: '100%'}}>
          <div className="intro-slide" style={{position: 'relative', backgroundColor: "#2a323e", minHeight: '600px'}}>
            <video autoPlay muted loop playsInline style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}>
              <source src={`${process.env.PUBLIC_URL}/assets/Clown_Fish_.mp4`} type="video/mp4" />
            </video>
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 0}}></div>
            <div className="container" style={{position: 'relative', height: '100%', minHeight: '600px'}}>
              <div className="intro-content intro-content-left" style={{position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', zIndex: 1}}>
                <h6 className="font-weight-normal text-primary my-2 mt-0">Aquarium Sale</h6>
                <h3 className="intro-title font-weight-bold text-white mb-0">Erode Marine<br />Aquarium</h3>
                <h3 className="intro-desc mb-2 font-weight-light text-secondary">"Bring the Ocean Home"</ h3>
                <Link to="/shop" className="btn btn-primary text-uppercase">Shop now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
