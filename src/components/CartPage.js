import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../config';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState('standard');

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, Math.max(1, newQuantity));
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleUpdateCart = () => {
    // Update cart logic here
    console.log('Cart updated');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 600.00;
  const total = subtotal + shippingCost;

  return (
    <main className="main">
      <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)` }}>
        <div className="container">
          <h1 className="page-title">Shopping Cart<span>Shop</span></h1>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Shopping Cart</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="cart">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <table className="table table-cart table-mobile">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td className="product-col">
                          <div className="product">
                            <figure className="product-media">
                              <Link to={`/product/${item.id}`}>
                                <img src={item.image ? (item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`) : (item.images && item.images.length > 0 ? `${API_BASE_URL}${item.images[0].startsWith('/') ? '' : '/'}${item.images[0]}` : '/assets/images/products/product-1.jpg')} alt="Product image" />
                              </Link>
                            </figure>
                            <h3 className="product-title">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h3>
                          </div>
                        </td>
                        <td className="price-col">₹{item.price.toFixed(2)}</td>
                        <td className="quantity-col">
                          <div className="cart-product-quantity">
                            <input
                              type="number"
                              className="form-control"
                              value={item.quantity}
                              min="1"
                              max="10"
                              step="1"
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="total-col">₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td className="remove-col">
                          <button className="btn-remove" onClick={() => handleRemoveItem(item.id)}>
                            <i className="icon-close"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="cart-bottom">
                  <button className="btn btn-outline-dark-2" onClick={handleUpdateCart}>
                    <span>UPDATE CART</span>
                    <i className="icon-refresh"></i>
                  </button>
                </div>
              </div>

              <aside className="col-lg-3">
                <div className="summary summary-cart">
                  <h3 className="summary-title">Cart Total</h3>
                  <table className="table table-summary">
                    <tbody>
                      <tr className="summary-subtotal">
                        <td>Subtotal:</td>
                        <td>₹{subtotal.toFixed(2)}</td>
                      </tr>
                      <tr className="summary-shipping">
                        <td>Shipping:</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr className="summary-shipping-row">
                        <td>
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              id="standard-shipping"
                              name="shipping"
                              className="custom-control-input"
                              value="standard"
                              checked={shippingMethod === 'standard'}
                              onChange={(e) => setShippingMethod(e.target.value)}
                            />
                            <label className="custom-control-label" htmlFor="standard-shipping">Shipping:</label>
                          </div>
                        </td>
                        <td>₹600.00</td>
                      </tr>
                      <tr className="summary-shipping-estimate">
                        <td>Estimate for Your Country<br /> <a href="/dashboard">Change address</a></td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr className="summary-total">
                        <td>Total:</td>
                        <td>₹{total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Link to="/checkout" className="btn btn-outline-primary-2 btn-order btn-block">
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
                <Link to="/shop" className="btn btn-outline-dark-2 btn-block mb-3">
                  <span>CONTINUE SHOPPING</span>
                  <i className="icon-refresh"></i>
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
