import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import './OrderManagement.css';
const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/deliver`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          fetchOrders(); // Refresh orders
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update order');
        }
      } catch (err) {
        setError('Failed to update order');
      }
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    if (window.confirm(`Are you sure you want to mark this order as ${status}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        if (response.ok) {
          fetchOrders(); // Refresh orders
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update order status');
        }
      } catch (err) {
        setError('Failed to update order status');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="text-center mt-5">Loading orders...</div>;

  return (
    <main className="main" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Order Management</h1>
          <a href="/admin" className="btn btn-secondary">Back to Admin Panel</a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">All Orders</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge bg-success">Paid</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        {order.status === 'delivered' ? (
                          <span className="badge bg-success">Delivered</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Details
                        </button>
                        <div className="dropdown position-relative">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === order._id ? null : order._id);
                            }}
                          >
                            {order.status || 'Pending'}
                          </button>
                          <ul
                            className={`dropdown-menu ${openDropdownId === order._id ? 'show' : ''}`}
                            style={{
                              display: openDropdownId === order._id ? 'block' : 'none',
                              position: 'absolute',
                              right: 0,
                              zIndex: 1000
                            }}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleUpdateStatus(order._id, 'pending');
                                  setOpenDropdownId(null);
                                }}
                              >
                                Pending
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleUpdateStatus(order._id, 'confirmed');
                                  setOpenDropdownId(null);
                                }}
                              >
                                Confirmed
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleUpdateStatus(order._id, 'delivered');
                                  setOpenDropdownId(null);
                                }}
                              >
                                Delivered
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => {
                                  handleUpdateStatus(order._id, 'cancelled');
                                  setOpenDropdownId(null);
                                }}
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - {selectedOrder._id}</h5>
                </div>
                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Customer Information</h6>
                      <p>
                        <strong>Name:</strong> {selectedOrder.shippingAddress?.name || selectedOrder.user?.name || 'N/A'}<br />
                        <strong>Address:</strong> {selectedOrder.shippingAddress.address}
                        {selectedOrder.shippingAddress.apartment && `, ${selectedOrder.shippingAddress.apartment}`}<br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state && `${selectedOrder.shippingAddress.state}, `} {selectedOrder.shippingAddress.postalCode}<br />
                        {selectedOrder.shippingAddress.country}<br />
                        <strong>Phone:</strong> {selectedOrder.shippingAddress.phone || 'N/A'}<br />
                        <strong>Email:</strong> {selectedOrder.shippingAddress.email || selectedOrder.user?.email || 'N/A'}
                      </p>
                      <h6>Payment Method</h6>
                      <p>{selectedOrder.paymentMethod}</p>
                      {selectedOrder.orderNotes && (
                        <div className="mt-3">
                          <h6>Order Notes</h6>
                          <p className="bg-light p-2 border rounded">{selectedOrder.orderNotes}</p>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6>Order Items</h6>
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{item.name} (x{item.qty})</span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>₹{selectedOrder.itemsPrice}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>₹{selectedOrder.shippingPrice}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>₹{selectedOrder.totalPrice}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderManagement;
