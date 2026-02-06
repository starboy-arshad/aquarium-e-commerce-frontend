import React from 'react';

const Footer = () => {
  return (
    <footer className="footer footer-2 font-weight-normal second-primary-color" style={{backgroundColor: "#222"}}>
      <div className="footer-middle border-0">
        <div className="container">
          <div className="row justify-content-start pl-3">
            <div className="col-12 col-lg-5 px-3">
              <div className="widget widget-about mb-4">
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <img src={`${process.env.PUBLIC_URL}/assets/images/erode_marine.jpg`} className="footer-logo" alt="Footer Logo" width="105" height="25" />
                  <h2 className="text-white ml-5">Erode Marine Aquarium</h2>
                </div>
                <p className="font-weight-light second-primary-color text-light">Complete aquarium shop with fish, tanks, plants, and all aquarium supplies. Your one-stop destination for all aquarium needs.</p>

                <div className="widget-about-info">
                  <div className="row">
                    <div className="col-sm-6 col-md-4">
                      <span className="widget-about-title text-white">Got Question? Call us </span>
                      <a href="tel:123456789" className="text-primary">+91 7010934029</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-lg-3 px-3 pl-3">
              <div className="widget mb-4">
                <h4 className="widget-title text-white">Customer Service</h4>
                <ul className="widget-list">
                  
                  <li><a href="/Policies#returns">Returns</a></li>
                  <li><a href="/Policies#shipping">Shipping</a></li>
                  <li><a href="/Policies#terms">Terms and conditions</a></li>
                  <li><a href="/Policies#privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="col-sm-4 col-lg-4 px-3">
              <div className="widget mb-4">
                <h4 className="widget-title text-white">My Account</h4>
                <ul className="widget-list">
                  <li><a href="/login">Sign In</a></li>
                  <li><a href="/cart">View Cart</a></li>
                
                  <li><a href="/account">Track My Order</a></li>
                  <li><a href="/contact">Help</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom font-weight-normal">
        <div className="container">
          <p className="footer-copyright font-weight-light text-light">Copyright © 2024 Aquarium Shop. All Rights Reserved.</p>
          <ul className="footer-menu justify-content-center">
            <li><a href="#">Terms Of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>

          <div className="social-icons social-icons-color justify-content-center">
            <span className="social-label">Social Media</span>
            <a href="#" className="social-icon social-facebook" title="Facebook" target="_blank"><i className="icon-facebook-f"></i></a>
            <a href="#" className="social-icon social-twitter" title="Twitter" target="_blank"><i className="icon-twitter"></i></a>
            <a href="#" className="social-icon social-instagram" title="Instagram" target="_blank"><i className="icon-instagram"></i></a>
            <a href="#" className="social-icon social-youtube" title="Youtube" target="_blank"><i className="icon-youtube"></i></a>
            <a href="#" className="social-icon social-pinterest" title="Pinterest" target="_blank"><i className="icon-pinterest"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
