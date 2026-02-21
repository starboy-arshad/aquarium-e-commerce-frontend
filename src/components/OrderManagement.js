import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import {
  Search,
  Eye,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  ChevronDown,
  Filter,
  Download,
  ShoppingBag,
  CreditCard,
  MapPin,
  Calendar
} from 'lucide-react';

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          fetchOrders();
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update order status');
        }
      } catch (err) {
        setError('Failed to update order status');
      }
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2"><CheckCircle size={12} className="me-1" /> Delivered</span>;
      case 'confirmed':
        return <span className="badge rounded-pill bg-info-subtle text-info px-3 py-2"><Truck size={12} className="me-1" /> Confirmed</span>;
      case 'cancelled':
        return <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2"><XCircle size={12} className="me-1" /> Cancelled</span>;
      default:
        return <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2"><Clock size={12} className="me-1" /> Pending</span>;
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>
    </div>
  );

  return (
    <div className="pb-5">
      {/* Header & Stats Section */}
      <div className="row mb-4 align-items-end">
        <div className="col-lg-6 mb-3">
          <h2 className="fw-bold mb-1">Order Management</h2>
          <p className="text-muted mb-0">Track and manage all customer purchases</p>
        </div>
        <div className="col-lg-6 mb-3 text-lg-end">
          <div className="d-inline-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <Download size={14} className="me-1" /> Export PDF
            </button>
            <div className="position-relative search-container">
              <Search className="position-absolute translate-middle-y top-50 start-0 ms-3 text-muted" size={16} />
              <input
                type="text"
                className="form-control form-control-sm rounded-pill ps-5 border-0 shadow-sm"
                placeholder="Search Orders..."
                style={{ height: '40px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4 summary-card-row">
        {[
          { label: 'Total Orders', count: orders.length, color: '#3182ce', icon: ShoppingBag },
          { label: 'Pending', count: orders.filter(o => !o.isDelivered).length, color: '#f6ad55', icon: Clock },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: '#48bb78', icon: CheckCircle },
          { label: 'Total Sales', count: `₹${orders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}`, color: '#805ad5', icon: CreditCard },
        ].map((stat, idx) => (
          <div className="col-md-3 mb-3 summary-card-col" key={idx}>
            <div className="card border-0 shadow-sm p-3 h-100">
              <div className="d-flex align-items-center">
                <div style={{ backgroundColor: `${stat.color}15`, color: stat.color, padding: '10px', borderRadius: '10px' }} className="me-3">
                  <stat.icon size={20} />
                </div>
                <div>
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>{stat.label}</small>
                  <h4 className="fw-bold mb-0">{stat.count}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted small text-uppercase fw-bold">
                <th className="px-4 py-3 border-0">Order ID</th>
                <th className="border-0">Customer</th>
                <th className="border-0">Date</th>
                <th className="border-0">Total</th>
                <th className="border-0">Payment</th>
                <th className="border-0">Status</th>
                <th className="border-0 text-end px-4">Action</th>
              </tr>
            </thead>
            <tbody className="pm-table-body">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id}>
                    <td className="px-4 py-3 fw-bold text-primary" data-label="Order ID">#{order._id.substring(0, 8)}</td>
                    <td data-label="Customer">
                      <div className="fw-bold">{order.user?.name || 'Guest'}</div>
                      <small className="text-muted">{order.user?.email || 'No Email'}</small>
                    </td>
                    <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="fw-bold" data-label="Total">₹{order.totalPrice.toLocaleString()}</td>
                    <td data-label="Payment">
                      {order.isPaid ? (
                        <span className="text-success small fw-bold">● Paid</span>
                      ) : (
                        <span className="text-warning small fw-bold">○ Unpaid</span>
                      )}
                    </td>
                    <td data-label="Status">{getStatusBadge(order.status)}</td>
                    <td className="text-end px-4 mobile-actions">
                      <div className="d-inline-flex gap-2">
                        <button
                          className="btn btn-light btn-sm border"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <div className="dropdown position-relative">
                          <button
                            className="btn btn-white btn-sm border d-flex align-items-center gap-1 dropdown-toggle"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === order._id ? null : order._id);
                            }}
                          >
                            Update <ChevronDown size={14} />
                          </button>
                          {openDropdownId === order._id && (
                            <div className="dropdown-menu show" style={{ position: 'absolute', right: 0, zIndex: 1000, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                              {['pending', 'confirmed', 'delivered', 'cancelled'].map(status => (
                                <button
                                  key={status}
                                  className="dropdown-item py-2 text-capitalize"
                                  onClick={() => {
                                    handleUpdateStatus(order._id, status);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  Mark as {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <ShoppingBag size={48} className="text-muted mb-3 opacity-25 d-block mx-auto" />
                    <p className="text-muted">No orders found matching your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary text-white p-4">
                <div>
                  <h5 className="modal-title fw-bold mb-0">Order Details</h5>
                  <small className="opacity-75">#{selectedOrder._id}</small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row g-4">
                  {/* Left Column: Info */}
                  <div className="col-md-7">
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 d-flex align-items-center"><MapPin size={18} className="me-2 text-primary" /> Shipping Information</h6>
                      <div className="card bg-light border-0 p-3 rounded-3">
                        <div className="fw-bold">{selectedOrder.shippingAddress?.name || selectedOrder.user?.name}</div>
                        <div className="small text-muted mb-2">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</div>
                        <div className="small">{selectedOrder.shippingAddress?.phone}</div>
                        <div className="small">{selectedOrder.shippingAddress?.email || selectedOrder.user?.email}</div>
                      </div>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-3 d-flex align-items-center"><ShoppingBag size={18} className="me-2 text-primary" /> Order Items</h6>
                      <div className="list-group list-group-flush">
                        {selectedOrder.orderItems.map((item, idx) => (
                          <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0 border-bottom">
                            <div>
                              <div className="fw-bold small">{item.name}</div>
                              <small className="text-muted">Qty: {item.qty} × ₹{item.price}</small>
                            </div>
                            <span className="fw-bold">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Right Column: Pricing */}
                  <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-3 rounded-4 bg-white mb-3">
                      <h6 className="fw-bold mb-3 d-flex align-items-center"><CreditCard size={18} className="me-2 text-primary" /> Payment & Summary</h6>
                      <div className="mb-3">
                        <small className="text-muted d-block">Method</small>
                        <span className="fw-bold">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.itemsPrice}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small">
                        <span>Shipping</span>
                        <span>₹{selectedOrder.shippingPrice}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between mb-0">
                        <span className="fw-bold h5">Total</span>
                        <span className="fw-bold h5 text-primary">₹{selectedOrder.totalPrice}</span>
                      </div>
                    </div>
                    <div className="card bg-light border-0 p-3 rounded-4">
                      <h6 className="fw-bold mb-2 small">Status</h6>
                      <div className="mb-2">{getStatusBadge(selectedOrder.status)}</div>
                      <small className="text-muted d-block mt-2"><Calendar size={12} className="me-1" /> Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setSelectedOrder(null)}>Close</button>
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => window.open(`/invoice/${selectedOrder._id}`, '_blank')}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .bg-success-subtle { background-color: #d1fae5; }
        .bg-info-subtle { background-color: #e0f2fe; }
        .bg-danger-subtle { background-color: #fee2e2; }
        .bg-warning-subtle { background-color: #fef3c7; }
        .text-success { color: #059669; }
        .text-info { color: #0284c7; }
        .text-danger { color: #dc2626; }
        .text-warning { color: #d97706; }
        .btn-white { background-color: #fff; }
        .rounded-4 { border-radius: 1rem !important; }
        .modal { z-index: 1050; }
        .dropdown-item:hover { background-color: #f8fafc; color: #3182ce; }

        @media (max-width: 991px) {
          .summary-card-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 15px; }
          .summary-card-col { min-width: 250px; }
        }

        @media (max-width: 767px) {
          .table thead { display: none; }
          .table tbody tr { display: block; padding: 15px; border-bottom: 8px solid #f8fafc; position: relative; }
          .table tbody td { display: flex; justify-content: flex-start; align-items: center; border: none; padding: 5px 0; font-size: 0.9rem; }
          .table tbody td::before { content: attr(data-label); width: 100px; font-weight: bold; color: #718096; flex-shrink: 0; font-size: 0.8rem; text-transform: uppercase; }
          .table tbody td.text-end { justify-content: flex-start; border-top: 1px solid #eee; margin-top: 10px; padding-top: 15px; }
          .table tbody td.text-end::before { content: 'Actions'; }
          
          .search-container { width: 100% !important; margin-top: 15px; }
          .header-actions { flex-direction: column; align-items: flex-start !important; }
          
          .modal-dialog { margin: 10px; }
          .modal-body { padding: 15px !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
