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

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return { color: '#059669', bg: '#d1fae5', icon: 'bi-check-circle-fill', label: 'Delivered' };
      case 'confirmed':
        return { color: '#0284c7', bg: '#e0f2fe', icon: 'bi-truck', label: 'Confirmed' };
      case 'cancelled':
        return { color: '#dc2626', bg: '#fee2e2', icon: 'bi-x-circle-fill', label: 'Cancelled' };
      case 'cancel_requested':
        return { color: '#dc2626', bg: '#fee2e2', icon: 'bi-exclamation-triangle-fill', label: 'Cancellation Requested' };
      default:
        return { color: '#d97706', bg: '#fef3c7', icon: 'bi-clock-fill', label: 'Pending' };
    }
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
        body: JSON.stringify({ status: 'cancel_requested' }),
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
              <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold mb-1">Order #{order._id.substring(0, 8)}</h5>
                    <p className="text-muted small mb-0">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-end">
                    {(() => {
                      const config = getStatusConfig(order.status);
                      return (
                        <span 
                          className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                          style={{ backgroundColor: config.bg, color: config.color, fontSize: '0.85rem' }}
                        >
                          <i className={`bi ${config.icon}`}></i> {config.label}
                        </span>
                      );
                    })()}
                    <div className="mt-2">
                      {order.isPaid ? (
                        <span className="badge rounded-pill bg-success-subtle text-success px-3 py-1 small">
                          <i className="bi bi-patch-check-fill me-1"></i> Paid
                        </span>
                      ) : (
                        <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-1 small">
                          <i className="bi bi-hourglass-split me-1"></i> Payment Pending
                        </span>
                      )}
                    </div>
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
                  {order.status !== 'cancelled' && order.status !== 'cancel_requested' && !order.isDelivered && (
                    <button
                      className="btn btn-danger"
                      onClick={handleCancelOrder}
                    >
                      Request Cancellation
                    </button>
                  )}
                  {order.status === 'cancel_requested' && (
                    <div className="alert alert-info py-2 mb-0 text-center" style={{ fontSize: '0.9rem' }}>
                      Cancellation request is pending admin approval.
                    </div>
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
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="fw-bold mb-0">Track Order</h5>
              </div>
              <div className="card-body p-4">
                <div className="modern-timeline">
                  {/* Step 1: Placed */}
                  <div className={`timeline-step completed`}>
                    <div className="step-icon">
                      <i className="bi bi-bag-check"></i>
                    </div>
                    <div className="step-content">
                      <h6 className="fw-bold mb-0">Order Placed</h6>
                      <p className="text-muted small">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Step 2: Payment */}
                  <div className={`timeline-step ${order.isPaid ? 'completed' : 'active'}`}>
                    <div className="step-icon">
                      <i className={`bi ${order.isPaid ? 'bi-credit-card-2-front-fill' : 'bi-credit-card'}`}></i>
                    </div>
                    <div className="step-content">
                      <h6 className="fw-bold mb-0">Payment {order.isPaid ? 'Confirmed' : 'Pending'}</h6>
                      <p className="text-muted small">
                        {order.isPaid ? `Processed on ${formatDate(order.paidAt)}` : 'Awaiting payment confirmation'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Status Progression */}
                  {order.status === 'cancelled' || order.status === 'cancel_requested' ? (
                    <div className="timeline-step active danger">
                      <div className="step-icon">
                        <i className={`bi ${order.status === 'cancelled' ? 'bi-x-circle-fill' : 'bi-exclamation-octagon'}`}></i>
                      </div>
                      <div className="step-content">
                        <h6 className="fw-bold mb-0">{order.status === 'cancelled' ? 'Order Cancelled' : 'Cancellation Request'}</h6>
                        <p className="text-muted small">
                          {order.status === 'cancelled' 
                            ? 'Your order has been cancelled and refund is initiated if applicable.' 
                            : 'We have received your cancellation request.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`timeline-step ${order.status === 'confirmed' || order.status === 'delivered' ? 'completed' : 'active'}`}>
                        <div className="step-icon">
                          <i className="bi bi-box-seam"></i>
                        </div>
                        <div className="step-content">
                          <h6 className="fw-bold mb-0">Processing</h6>
                          <p className="text-muted small">
                            {order.status === 'confirmed' || order.status === 'delivered'
                              ? 'Order confirmed and packed'
                              : 'Your order is being prepared'}
                          </p>
                        </div>
                      </div>

                      <div className={`timeline-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                        <div className="step-icon">
                          <i className="bi bi-truck"></i>
                        </div>
                        <div className="step-content">
                          <h6 className="fw-bold mb-0">Out for Delivery</h6>
                          <p className="text-muted small">
                            {order.status === 'delivered' ? 'Package handed over to courier' : 'Expected soon'}
                          </p>
                        </div>
                      </div>

                      <div className={`timeline-step ${order.status === 'delivered' ? 'completed success' : ''}`}>
                        <div className="step-icon">
                          <i className="bi bi-house-check-fill"></i>
                        </div>
                        <div className="step-content">
                          <h6 className="fw-bold mb-0">Delivered</h6>
                          <p className="text-muted small">
                            {order.status === 'delivered' && order.deliveredAt
                              ? `Delivered on ${formatDate(order.deliveredAt)}`
                              : 'Waiting for delivery'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
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