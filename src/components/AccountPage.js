import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import './AccountPage.css';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const { user, logout, updateProfile, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const response = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        setOrdersError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setOrdersError('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.name) {
      const nameParts = user.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
    if (user && user.billingAddress) {
      setBillingAddress(user.billingAddress);
    }
    if (user && user.shippingAddress) {
      setShippingAddress(user.shippingAddress);
    }
  }, [user]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword && !currentPassword) {
      alert('Please enter your current password to change it');
      return;
    }
    const fullName = `${firstName} ${lastName}`.trim();
    const email = user.email; // assuming email doesn't change, but we can allow it
    await updateProfile(fullName, email, newPassword || undefined, currentPassword || undefined, billingAddress, shippingAddress);
    if (!error) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSaveBilling = async () => {
    await updateProfile(user.name, user.email, undefined, undefined, billingAddress, undefined);
    setShowBillingForm(false);
  };

  const handleSaveShipping = async () => {
    await updateProfile(user.name, user.email, undefined, undefined, undefined, shippingAddress);
    setShowShippingForm(false);
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main" style={{ paddingTop: '100px' }}>
        <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="container">
            <h1 className="page-title" style={{ color: 'white' }}>Account<span>Shop</span></h1>
          </div>
        </div>
        <nav aria-label="breadcrumb" className="breadcrumb-nav mb-0">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Shop</a></li>
              <li className="breadcrumb-item active" aria-current="page">Account</li>
            </ol>
          </div>
        </nav>
        <div className="page-content">
          <div className="dashboard">
            <div className="container my-5 px-5">
              <div className="row">
                <aside className="col-md-4 col-lg-3">
                  <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        id="tab-dashboard-link"
                        data-toggle="tab"
                        href="#tab-dashboard"
                        role="tab"
                        aria-controls="tab-dashboard"
                        aria-selected={activeTab === 'dashboard'}
                        onClick={() => handleTabClick('dashboard')}
                      >
                        Dashboard
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                        id="tab-orders-link"
                        data-toggle="tab"
                        href="#tab-orders"
                        role="tab"
                        aria-controls="tab-orders"
                        aria-selected={activeTab === 'orders'}
                        onClick={() => handleTabClick('orders')}
                      >
                        Orders
                      </a>
                    </li>

                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'address' ? 'active' : ''}`}
                        id="tab-address-link"
                        data-toggle="tab"
                        href="#tab-address"
                        role="tab"
                        aria-controls="tab-address"
                        aria-selected={activeTab === 'address'}
                        onClick={() => handleTabClick('address')}
                      >
                        Addresses
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                        id="tab-account-link"
                        data-toggle="tab"
                        href="#tab-account"
                        role="tab"
                        aria-controls="tab-account"
                        aria-selected={activeTab === 'account'}
                        onClick={() => handleTabClick('account')}
                      >
                        Account Details
                      </a>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link btn btn-link" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
                    </li>
                  </ul>
                </aside>
                <div className="col-md-8 col-lg-9">
                  <div className="tab-content">
                    {activeTab === 'dashboard' && (
                      <div className="tab-pane fade show active" id="tab-dashboard" role="tabpanel" aria-labelledby="tab-dashboard-link">
                        <p>Hello <span className="font-weight-normal text-dark">{lastName}</span> (not <span className="font-weight-normal text-dark">{lastName}</span>? <a href="#" onClick={(e) => { e.preventDefault(); logout(); navigate('/'); }}>Log out</a>)
                          <br />
                          From your account dashboard you can view your <a href="#tab-orders" className="tab-trigger-link link-underline" onClick={() => handleTabClick('orders')}>recent orders</a>, manage your <a href="#tab-address" className="tab-trigger-link" onClick={() => handleTabClick('address')}>shipping and billing addresses</a>, and <a href="#tab-account" className="tab-trigger-link" onClick={() => handleTabClick('account')}>edit your password and account details</a>.</p>
                      </div>
                    )}
                    {activeTab === 'orders' && (
                      <div className="tab-pane fade show active" id="tab-orders" role="tabpanel" aria-labelledby="tab-orders-link">
                        {ordersLoading ? (
                          <p>Loading orders...</p>
                        ) : ordersError ? (
                          <div className="alert alert-danger">{ordersError}</div>
                        ) : orders.length === 0 ? (
                          <div>
                            <p>No order has been made yet.</p>
                            <a href="/shop" className="btn btn-outline-primary-2"><span>GO SHOP</span><i className="icon-long-arrow-right"></i></a>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Order ID</th>
                                  <th>Date</th>
                                  <th>Total</th>
                                  <th>Status</th>
                                  <th>Payment</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.map(order => (
                                  <tr key={order._id}>
                                    <td>{order._id.substring(0, 8)}...</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td>
                                      <span className={`badge ${order.status === 'delivered' ? 'bg-success' : 'bg-warning'}`}>
                                        {order.status || 'Pending'}
                                      </span>
                                    </td>
                                    <td>
                                      {order.isPaid ? (
                                        <span className="badge bg-success">Paid</span>
                                      ) : (
                                        <span className="badge bg-warning">Pending</span>
                                      )}
                                    </td>
                                    <td>
                                      <a href={`/order/${order._id}`} className="btn btn-sm btn-outline-primary" onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/order/${order._id}`);
                                      }}>View Details</a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'address' && (
                      <div className="tab-pane fade show active" id="tab-address" role="tabpanel" aria-labelledby="tab-address-link">
                        <p>The following addresses will be used on the checkout page by default.</p>
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="card card-dashboard">
                              <div className="card-body">
                                <h3 className="card-title">Billing Address</h3>
                                {showBillingForm ? (
                                  <div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <label>Name</label>
                                        <input type="text" className="form-control" value={billingAddress.name || ''} onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })} />
                                      </div>
                                      <div className="col-sm-6">
                                        <label>Company</label>
                                        <input type="text" className="form-control" value={billingAddress.company || ''} onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })} />
                                      </div>
                                    </div>
                                    <label>Street Address</label>
                                    <input type="text" className="form-control" value={billingAddress.street || ''} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} />
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <label>City</label>
                                        <input type="text" className="form-control" value={billingAddress.city || ''} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                                      </div>
                                      <div className="col-sm-4">
                                        <label>State</label>
                                        <input type="text" className="form-control" value={billingAddress.state || ''} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                                      </div>
                                      <div className="col-sm-4">
                                        <label>ZIP Code</label>
                                        <input type="text" className="form-control" value={billingAddress.zip || ''} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <label>Phone</label>
                                        <input type="text" className="form-control" value={billingAddress.phone || ''} onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })} />
                                      </div>
                                      <div className="col-sm-6">
                                        <label>Email</label>
                                        <input type="email" className="form-control" value={billingAddress.email || ''} onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })} />
                                      </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleSaveBilling} disabled={loading}>Save Billing Address</button>
                                  </div>
                                ) : user.billingAddress ? (
                                  <div>
                                    <p style={{ whiteSpace: 'pre-line' }}>
                                      {user.billingAddress.name}
                                      {user.billingAddress.company ? '\n' + user.billingAddress.company.replace(/<br\s*\/?>/gi, '\n') : ''}
                                      {user.billingAddress.street ? '\n' + user.billingAddress.street.replace(/<br\s*\/?>/gi, '\n') : ''}
                                      {'\n' + user.billingAddress.city}, {user.billingAddress.state} {user.billingAddress.zip}
                                      {'\n' + user.billingAddress.phone}
                                      {'\n' + user.billingAddress.email}
                                    </p>
                                    <button className="btn btn-link" onClick={() => setShowBillingForm(true)}>Edit <i className="icon-edit"></i></button>
                                  </div>
                                ) : (
                                  <p>You have not set up this type of address yet.<br />
                                    <button className="btn btn-primary" onClick={() => setShowBillingForm(true)}>Add Address</button></p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="card card-dashboard">
                              <div className="card-body">
                                <h3 className="card-title">Shipping Address</h3>
                                {showShippingForm ? (
                                  <div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <label>Name</label>
                                        <input type="text" className="form-control" value={shippingAddress.name || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} />
                                      </div>
                                      <div className="col-sm-6">
                                        <label>Company</label>
                                        <input type="text" className="form-control" value={shippingAddress.company || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })} />
                                      </div>
                                    </div>
                                    <label>Street Address</label>
                                    <input type="text" className="form-control" value={shippingAddress.street || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
                                    <div className="row">
                                      <div className="col-sm-4">
                                        <label>City</label>
                                        <input type="text" className="form-control" value={shippingAddress.city || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                                      </div>
                                      <div className="col-sm-4">
                                        <label>State</label>
                                        <input type="text" className="form-control" value={shippingAddress.state || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
                                      </div>
                                      <div className="col-sm-4">
                                        <label>ZIP Code</label>
                                        <input type="text" className="form-control" value={shippingAddress.zip || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-sm-6">
                                        <label>Phone</label>
                                        <input type="text" className="form-control" value={shippingAddress.phone || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                                      </div>
                                      <div className="col-sm-6">
                                        <label>Email</label>
                                        <input type="email" className="form-control" value={shippingAddress.email || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })} />
                                      </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={handleSaveShipping} disabled={loading}>Save Shipping Address</button>
                                  </div>
                                ) : user.shippingAddress ? (
                                  <div>
                                    <p style={{ whiteSpace: 'pre-line' }}>
                                      {user.shippingAddress.name}
                                      {user.shippingAddress.company ? '\n' + user.shippingAddress.company.replace(/<br\s*\/?>/gi, '\n') : ''}
                                      {user.shippingAddress.street ? '\n' + user.shippingAddress.street.replace(/<br\s*\/?>/gi, '\n') : ''}
                                      {'\n' + user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zip}
                                      {'\n' + user.shippingAddress.phone}
                                      {'\n' + user.shippingAddress.email}
                                    </p>
                                    <button className="btn btn-link" onClick={() => setShowShippingForm(true)}>Edit <i className="icon-edit"></i></button>
                                  </div>
                                ) : (
                                  <p>You have not set up this type of address yet.<br />
                                    <button className="btn btn-primary" onClick={() => setShowShippingForm(true)}>Add Address</button></p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'account' && (
                      <div className="tab-pane fade show active" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-sm-6">
                              <label>First Name *</label>
                              <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="col-sm-6">
                              <label>Last Name *</label>
                              <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                          </div>

                          <label>Email address *</label>
                          <input type="email" className="form-control" value={user?.email || ''} readOnly required />
                          <label>Current password (leave blank to leave unchanged)</label>
                          <div className="password-input-container">
                            <input type={showCurrentPassword ? "text" : "password"} className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <span className="password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                              <i className="icon-eye"></i>
                            </span>
                          </div>
                          <label>New password (leave blank to leave unchanged)</label>
                          <div className="password-input-container">
                            <input type={showNewPassword ? "text" : "password"} className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <span className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                              <i className="icon-eye"></i>
                            </span>
                          </div>
                          <label>Confirm new password</label>
                          <div className="password-input-container">
                            <input type={showConfirmPassword ? "text" : "password"} className="form-control mb-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              <i className="icon-eye"></i>
                            </span>
                          </div>

                          <h3>Billing Address</h3>
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Name</label>
                              <input type="text" className="form-control" value={billingAddress.name || ''} onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })} />
                            </div>
                            <div className="col-sm-6">
                              <label>Company</label>
                              <input type="text" className="form-control" value={billingAddress.company || ''} onChange={(e) => setBillingAddress({ ...billingAddress, company: e.target.value })} />
                            </div>
                          </div>
                          <label>Street Address</label>
                          <input type="text" className="form-control" value={billingAddress.street || ''} onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })} />
                          <div className="row">
                            <div className="col-sm-4">
                              <label>City</label>
                              <input type="text" className="form-control" value={billingAddress.city || ''} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                            </div>
                            <div className="col-sm-4">
                              <label>State</label>
                              <input type="text" className="form-control" value={billingAddress.state || ''} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                            </div>
                            <div className="col-sm-4">
                              <label>ZIP Code</label>
                              <input type="text" className="form-control" value={billingAddress.zip || ''} onChange={(e) => setBillingAddress({ ...billingAddress, zip: e.target.value })} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Phone</label>
                              <input type="text" className="form-control" value={billingAddress.phone || ''} onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })} />
                            </div>
                            <div className="col-sm-6">
                              <label>Email</label>
                              <input type="email" className="form-control" value={billingAddress.email || ''} onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })} />
                            </div>
                          </div>

                          <h3>Shipping Address</h3>
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Name</label>
                              <input type="text" className="form-control" value={shippingAddress.name || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} />
                            </div>
                            <div className="col-sm-6">
                              <label>Company</label>
                              <input type="text" className="form-control" value={shippingAddress.company || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })} />
                            </div>
                          </div>
                          <label>Street Address</label>
                          <input type="text" className="form-control" value={shippingAddress.street || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} />
                          <div className="row">
                            <div className="col-sm-4">
                              <label>City</label>
                              <input type="text" className="form-control" value={shippingAddress.city || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                            </div>
                            <div className="col-sm-4">
                              <label>State</label>
                              <input type="text" className="form-control" value={shippingAddress.state || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })} />
                            </div>
                            <div className="col-sm-4">
                              <label>ZIP Code</label>
                              <input type="text" className="form-control" value={shippingAddress.zip || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                              <label>Phone</label>
                              <input type="text" className="form-control" value={shippingAddress.phone || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} />
                            </div>
                            <div className="col-sm-6">
                              <label>Email</label>
                              <input type="email" className="form-control" value={shippingAddress.email || ''} onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })} />
                            </div>
                          </div>

                          <button type="submit" className="btn btn-outline-primary-2" disabled={loading}>
                            <span>{loading ? 'SAVING...' : 'SAVE CHANGES'}</span>
                            <i className="icon-long-arrow-right"></i>
                          </button>
                          {error && <div className="error-message">{error}</div>}
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
