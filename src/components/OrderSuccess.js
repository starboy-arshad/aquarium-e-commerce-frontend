import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="page-wrapper">
      <main className="main">
        <div className="page-header text-center" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`}}>
          <div className="container">
            <h1 className="page-title">Order Success<span>Thank You</span></h1>
          </div>
        </div>
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
              <li className="breadcrumb-item active" aria-current="page">Order Success</li>
            </ol>
          </div>
        </nav>

        <div className="page-content">
          <div className="container">
            <div className="text-center">
              <h2 className="mb-4">Thank you for your order!</h2>
              <p className="mb-4">Your order has been successfully placed. You will receive a confirmation email shortly.</p>
              <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
            </div>
           < br />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
