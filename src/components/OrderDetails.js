import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (order && order.paymentMethod === 'PhonePe' && !order.isPaid) {
      const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/phonepe/status/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchOrderDetails();
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        fetchOrderDetails(); // Refresh order status
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to cancel order');
      }
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="alert alert-danger">
            {error}
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/account')}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="alert alert-warning">
            Order not found.
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/account')}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Order Details</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/account')}>
            Back to Orders
          </button>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Order Summary */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Order #{order._id.substring(0, 8)}...</h5>
                <div className="order-meta d-flex justify-content-between align-items-center mt-2">
                  <div>
                    <span className="badge bg-primary me-2">Order Date: {formatDate(order.createdAt)}</span> &nbsp; &nbsp;
                    <span className={`badge ${order.status === 'delivered' ? 'bg-success' : order.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                      Status: {order.status || 'Pending'}
                    </span>
                  </div>
                  <div>
                    {order.isPaid ? (
                      <span className="badge bg-success">Paid</span>
                    ) : (
                      <span className="badge bg-warning">Pending Payment</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Customer Information</h6>
                    <p className="mb-0">
                      <strong>Name:</strong> {order.shippingAddress.name || order.user?.name || user.name}<br />
                      <strong>Address:</strong> {order.shippingAddress.address}
                      {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state && `${order.shippingAddress.state}, `} {order.shippingAddress.zip || order.shippingAddress.postalCode || ''}<br />
                      {order.shippingAddress.country || ''}<br />
                      <strong>Phone:</strong> {order.shippingAddress.phone || user.phone || ''}<br />
                      <strong>Email:</strong> {order.shippingAddress.email || order.user?.email || user.email || ''}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Payment Method</h6>
                    <p className="mb-0">{order.paymentMethod}</p>
                    {order.orderNotes && (
                      <div className="mt-3">
                        <h6>Order Notes</h6>
                        <p className="bg-light p-2 border rounded mb-0 text-muted" style={{ fontSize: '0.9rem' }}>{order.orderNotes}</p>
                      </div>
                    )}
                    {order.isPaid && (
                      <div className="mt-2">
                        <h6>Payment Details</h6>
                        <p className="mb-0">
                          <strong>Transaction ID:</strong> {order.paymentResult?.id || 'N/A'}<br />
                          <strong>Paid At:</strong> {order.paidAt ? formatDate(order.paidAt) : 'N/A'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Order Items</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                <h6 className="mb-1">{item.name}</h6>
                                {item.category && (
                                  <small className="text-muted">Category: {item.category}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>₹{item.price}</td>
                          <td>{item.qty}</td>
                          <td>₹{item.price * item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Totals */}
                <div className="row justify-content-end">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="mb-3">Order Summary</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{order.itemsPrice}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>₹{order.shippingPrice}</span>
                      </div>
                      {order.taxPrice > 0 && (
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax:</span>
                          <span>₹{order.taxPrice}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>₹{order.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Order Actions */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Order Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/shop')}
                  >
                    Continue Shopping
                  </button>
                  &nbsp;
                  {order.status !== 'cancelled' && !order.isDelivered && (
                    <button
                      className="btn btn-danger"
                      onClick={handleCancelOrder}
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/invoice/${orderId}`)}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Order Status</h4> <br />
              </div>
              <div className="card-body">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker">
                      <i className="bi bi-cart-check"></i>
                    </div>
                    <div className="timeline-content">
                      <h6>Order Placed</h6>
                      <p className="text-muted mb-0">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker">
                      <i className="bi bi-credit-card"></i>
                    </div>
                    <div className="timeline-content">
                      <h6>Payment {order.isPaid ? 'Completed' : 'Pending'}</h6>
                      <p className="text-muted mb-0">
                        {order.isPaid ? formatDate(order.paidAt) : 'Awaiting payment'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker">
                      <i className="bi bi-truck"></i>
                    </div>
                    <div className="timeline-content">
                      <h6>Order {order.status === 'delivered' ? 'Delivered' : 'In Progress'}</h6>
                      <p className="text-muted mb-0">
                        {order.status === 'delivered' && order.deliveredAt
                          ? formatDate(order.deliveredAt)
                          : 'Your order is being processed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;