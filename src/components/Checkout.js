import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    stateCounty: '',
    postcode: '',
    phone: '',
    email: '',
    createAccount: false,
    shipToDifferentAddress: false,
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setBillingDetails(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        streetAddress: user.billingAddress?.street || '',
        townCity: user.billingAddress?.city || '',
        stateCounty: user.billingAddress?.state || '',
        postcode: user.billingAddress?.zip || '',
        company: user.billingAddress?.company || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check minimum order amount before proceeding
    if (cartTotal < 3000) {
      alert('Minimum order amount should be ₹3000');
      setLoading(false);
      return;
    }

    if (!user || !user.token) {
      alert('Please log in to place an order.');
      navigate('/login');
      setLoading(false);
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id
      }));

      const shippingAddress = {
        address: billingDetails.streetAddress,
        city: billingDetails.townCity,
        postalCode: billingDetails.postcode,
        country: billingDetails.country
      };

      const shippingPrice = 600.00;
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: 0,
        shippingPrice,
        totalPrice: getCartTotal() + shippingPrice
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart after successful order
        clearCart();
        navigate('/order-success');
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = getCartTotal() + 600; // subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Your cart is empty</h2>
          <a href="/shop" className="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    );
  }

  if (cartTotal < 3000) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Minimum Order Amount Not Met</h2>
          <p className="lead">The minimum order amount is ₹3000. Your current total is ₹{cartTotal.toFixed(2)}.</p>
          <p>Please add more items to your cart to proceed to checkout.</p>
          <a href="/shop" className="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <main className="main">
        <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)` }}>
          <div className="container">
            <h1 className="page-title">Checkout<span>Shop</span></h1>
          </div>
        </div>
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
              <li className="breadcrumb-item active" aria-current="page">Checkout</li>
            </ol>
          </div>
        </nav>

        <div className="page-content">
          <div className="checkout">
            <div className="container">

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-9">
                    <h2 className="checkout-title">Billing Details</h2>
                    <div className="row">
                      <div className="col-sm-6">
                        <label>First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={billingDetails.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={billingDetails.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <label>Company Name (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={billingDetails.company}
                      onChange={handleInputChange}
                    />

                    <label>Country *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={billingDetails.country}
                      onChange={handleInputChange}
                      required
                    />

                    <label>Street address *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="House number and Street name"
                      name="streetAddress"
                      value={billingDetails.streetAddress}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apartment, suite, unit etc ..."
                      name="apartment"
                      value={billingDetails.apartment}
                      onChange={handleInputChange}
                    />

                    <div className="row">
                      <div className="col-sm-6">
                        <label>Town / City *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="townCity"
                          value={billingDetails.townCity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>State / County *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="stateCounty"
                          value={billingDetails.stateCounty}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6">
                        <label>Postcode / ZIP *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="postcode"
                          value={billingDetails.postcode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={billingDetails.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <label>Email address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={billingDetails.email}
                      onChange={handleInputChange}
                      required
                    />

                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="checkout-create-acc"
                        name="createAccount"
                        checked={billingDetails.createAccount}
                        onChange={handleInputChange}
                      />

                    </div>

                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="checkout-diff-address"
                        name="shipToDifferentAddress"
                        checked={billingDetails.shipToDifferentAddress}
                        onChange={handleInputChange}
                      />

                    </div>

                    <label>Order notes (optional)</label>
                    <textarea
                      className="form-control"
                      cols="30"
                      rows="4"
                      placeholder="Notes about your order, e.g. special notes for delivery"
                      name="orderNotes"
                      value={billingDetails.orderNotes}
                      onChange={handleInputChange}
                    />
                  </div>

                  <aside className="col-lg-3">
                    <div className="summary">
                      <h3 className="summary-title">Your Order</h3>
                      <table className="table table-summary">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map(item => (
                            <tr key={item.id}>
                              <td>
                                <a href={`/product/${item.id}`}>{item.name}</a>
                                <span className="d-block">Qty: {item.quantity}</span>
                              </td>
                              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="summary-subtotal">
                            <td>Subtotal:</td>
                            <td>₹{getCartTotal().toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Shipping:</td>
                            <td>₹600.00</td>
                          </tr>
                          <tr className="summary-total">
                            <td>Total:</td>
                            <td>₹{(getCartTotal() + 600).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="accordion-summary" id="accordion-payment">
                        <div className="card">
                          <div className="card-header" id="heading-1">
                            <h2 className="card-title">
                              <a
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-1"
                                aria-expanded={paymentMethod === 'bank-transfer'}
                                aria-controls="collapse-1"
                                onClick={() => setPaymentMethod('bank-transfer')}
                              >
                                Direct bank transfer
                              </a>
                            </h2>
                          </div>
                          <div id="collapse-1" className={`collapse ${paymentMethod === 'bank-transfer' ? 'show' : ''}`} aria-labelledby="heading-1" data-parent="#accordion-payment">
                            <div className="card-body">
                              Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="heading-2">
                            <h2 className="card-title">
                              <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-2"
                                aria-expanded={paymentMethod === 'check'}
                                aria-controls="collapse-2"
                                onClick={() => setPaymentMethod('check')}
                              >
                                Check payments
                              </a>
                            </h2>
                          </div>
                          <div id="collapse-2" className={`collapse ${paymentMethod === 'check' ? 'show' : ''}`} aria-labelledby="heading-2" data-parent="#accordion-payment">
                            <div className="card-body">
                              Ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis.
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="heading-3">
                            <h2 className="card-title">
                              <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-3"
                                aria-expanded={paymentMethod === 'cod'}
                                aria-controls="collapse-3"
                                onClick={() => setPaymentMethod('cod')}
                              >
                                Cash on delivery
                              </a>
                            </h2>
                          </div>
                          <div id="collapse-3" className={`collapse ${paymentMethod === 'cod' ? 'show' : ''}`} aria-labelledby="heading-3" data-parent="#accordion-payment">
                            <div className="card-body">
                              Quisque volutpat mattis eros. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros.
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="heading-4">
                            <h2 className="card-title">
                              <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-4"
                                aria-expanded={paymentMethod === 'paypal'}
                                aria-controls="collapse-4"
                                onClick={() => setPaymentMethod('paypal')}
                              >
                                PayPal <small className="float-right paypal-link">What is PayPal?</small>
                              </a>
                            </h2>
                          </div>
                          <div id="collapse-4" className={`collapse ${paymentMethod === 'paypal' ? 'show' : ''}`} aria-labelledby="heading-4" data-parent="#accordion-payment">
                            <div className="card-body">
                              Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede. Donec nec justo eget felis facilisis fermentum.
                            </div>
                          </div>
                        </div>

                        <div className="card">
                          <div className="card-header" id="heading-5">
                            <h2 className="card-title">
                              <a
                                className="collapsed"
                                role="button"
                                data-toggle="collapse"
                                href="#collapse-5"
                                aria-expanded={paymentMethod === 'stripe'}
                                aria-controls="collapse-5"
                                onClick={() => setPaymentMethod('stripe')}
                              >
                                Credit Card (Stripe)
                                <img src={`${process.env.PUBLIC_URL}/assets/images/payments-summary.png`} alt="payments cards" />
                              </a>
                            </h2>
                          </div>
                          <div id="collapse-5" className={`collapse ${paymentMethod === 'stripe' ? 'show' : ''}`} aria-labelledby="heading-5" data-parent="#accordion-payment">
                            <div className="card-body">
                              Donec nec justo eget felis facilisis fermentum.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Lorem ipsum dolor sit ame.
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-outline-primary-2 btn-order btn-block"
                        disabled={loading}
                      >
                        <span className="btn-text">
                          {loading ? 'Placing Order...' : 'Place Order'}
                        </span>
                        <span className="btn-hover-text">Proceed to Checkout</span>
                      </button>
                    </div>
                  </aside>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
