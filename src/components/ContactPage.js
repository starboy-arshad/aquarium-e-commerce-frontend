import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert(result.message || 'There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please check your internet connection and try again.');
    }
  };

  return (
    <main className="main">

      {/* ===== INLINE CSS (SINGLE FILE) ===== */}
      <style>{`
        .breadcrumb-nav {
          background: #f8f9fa;
          padding: 12px 0;
        }

        .contact-hero {
          width: 100%;
          height: 380px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-hero-overlay {
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 600;
          color: #fff;
        }

        .page-title span {
          font-size: 1rem;
          font-weight: 400;
          display: block;
          margin-top: 8px;
        }

        .contact-info h3 {
          margin-top: 20px;
          font-size: 1.2rem;
        }

        .contact-info a {
          color: #007bff;
          text-decoration: none;
        }

        .contact-info a:hover {
          text-decoration: underline;
        }

        .form-control {
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .contact-hero {
            height: 260px;
          }

          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* ===== BREADCRUMB ===== */}
      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active">
              Contact Us
            </li>
          </ol>
        </div>
      </nav>

      {/* ===== HERO BANNER ===== */}
      <div
        className="contact-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`
        }}
      >
        <div className="contact-hero-overlay">
          <h1 className="page-title">
            Contact Us
            <span>Keep in touch with us</span>
          </h1>
        </div>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      <div className="page-content py-5" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <div className="container">
          <div className="row">

            {/* ===== LEFT INFO ===== */}
            <div className="col-lg-6 mb-4">
              <h2>Contact Information</h2>
              <p>
                Complete aquarium shop with fish, tanks, plants,
                and all aquarium supplies.
              </p>

              <div className="contact-info">
                <h3>The Office</h3>
                <p>
                  Erode Marine Aquarium<br />
                  1/65, Thilagar Street<br />
                  Veerappan Chatram<br />
                  Erode – 638004, Tamil Nadu
                </p>

                <p>
                  📞 <a href="tel:+917010934029">+91 7010934029</a><br />
                  ✉ <a href="mailto:erodemarineaquarium@gmail.com">
                    erodemarineaquarium@gmail.com
                  </a>
                </p>

                <h3>Store Hours</h3>
                <p>
                  Monday – Saturday: 9am – 7pm<br />
                  Sunday: 10am – 6pm
                </p>
              </div>
            </div>

            {/* ===== CONTACT FORM ===== */}
            <div className="col-lg-6">
              <h2>Got Any Questions?</h2>
              <p>Use the form below to get in touch</p>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Name *"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Email *"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className="form-control"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <textarea
                  className="form-control"
                  rows="4"
                  name="message"
                  placeholder="Message *"
                  required
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>

                <button
                  type="submit"
                  className="btn btn-outline-primary-2 mt-3"
                >
                  SUBMIT →
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
};

export default ContactPage;
