import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <main className="main">
      <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="page-title" style={{ color: 'white' }}>About Us</h1>
          <p className="page-subtitle" style={{ color: 'white' }}>Learn more about Erode Marine Aquarium and our passion for aquatic life</p>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">About Us</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
        <div className="row">
          <div className="col-lg-6 px-5">
            <div className="about-content">
              <h2>Our Story</h2>
              <p>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Founded in Erode, Tamil Nadu, Erode Marine Aquarium has been serving aquarium enthusiasts for over a decade.
                Our journey began with a simple passion for aquatic life and has grown into a comprehensive destination for
                all things related to aquariums and marine life.
              
                We specialize in providing high-quality fish, aquarium equipment, plants, and accessories. Our team of
                experienced aquarists ensures that every product meets the highest standards of quality and care.
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-image">
              <img src={`${process.env.PUBLIC_URL}/assets/card1.jpg`} alt="Aquarium" />
            </div>
          </div>
        </div>

        <div className="row mt-5 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="feature-box text-center">
              <i className="icon-star"></i>
              <h3>Quality Fish</h3>
              <p>We source only the healthiest and most vibrant fish species from trusted suppliers.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="feature-box text-center">
            <i className="icon-heart"></i>
              <h3>Aquatic Plants</h3>
              <p>Beautiful and healthy aquatic plants to create stunning underwater landscapes.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="feature-box text-center">
              <i className="icon-cog"></i>
              <h3>Expert Support</h3>
              <p>Our knowledgeable staff provides expert advice and ongoing support for your aquarium needs.</p>
            </div>
          </div>
        </div>

        <div className="mission-section mt-5">
          <h2>Our Mission</h2>
          <p>
            To provide aquarium enthusiasts with the highest quality products and expert knowledge to create thriving aquatic environments. 
            We are committed to promoting responsible fishkeeping practices and fostering a community of passionate aquarists.
          </p>
        </div>

        <div className="contact-section mt-5 bg-light p-5 rounded">
          <h2>Visit Us</h2>
          <p style={{ fontSize: '1.1rem' }}>
            We welcome you to visit our store in Erode to see our wide selection of fish, plants, and aquarium supplies. 
            Our knowledgeable staff is always ready to help you with any questions or advice you may need.
          </p> <br />
          <p style={{ fontSize: '1.1rem' }}>
            <strong>Address:</strong> <span style={{ fontSize: '1.7rem' }}>1/65, Thilagar Street, Veerappan Chatram, Erode – 638004, Tamil Nadu</span><br />
            <strong>Phone:</strong> <span style={{ fontSize: '1.7rem' }}>+91 7010934029</span><br />
            <strong>Hours:</strong> <span style={{ fontSize: '1.7rem' }}>Monday - Saturday: 9am - 7pm, Sunday: 10am - 6pm</span>
          </p>
        </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;