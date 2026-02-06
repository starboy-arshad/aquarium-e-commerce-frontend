import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const AdminPanel = () => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="main">
        <div className="container">
          <h1 className="text-center mb-4">Admin Panel</h1>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Products</h5>
                  <p className="card-text flex-grow-1">Manage products, add new items, update inventory.</p>
                  <Link to="/admin/products" className="btn btn-primary mt-auto">Manage Products</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Categories</h5>
                  <p className="card-text flex-grow-1">Manage product categories, add new categories, update existing ones.</p>
                  <Link to="/admin/categories" className="btn btn-primary mt-auto">Manage Categories</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Orders</h5>
                  <p className="card-text flex-grow-1">View and manage customer orders.</p>
                  <Link to="/admin/orders" className="btn btn-primary mt-auto">Manage Orders</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Users</h5>
                  <p className="card-text flex-grow-1">Manage user accounts and permissions.</p>
                  <Link to="/admin/users" className="btn btn-primary mt-auto">Manage Users</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Reports</h5>
                  <p className="card-text flex-grow-1">View sales reports and analytics.</p>
                  <Link to="/admin/reports" className="btn btn-primary mt-auto">View Reports</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Full Marine Setup</h5>
                  <p className="card-text flex-grow-1">View and manage full marine setup products in the shop.</p>
                  <Link to="/admin/full-marine-setup" className="btn btn-primary mt-auto">Manage Products</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Accessories</h5>
                  <p className="card-text flex-grow-1">Manage aquarium accessories, add new items, update stock.</p>
                  <Link to="/admin/accessories" className="btn btn-primary mt-auto">Manage Accessories</Link>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">Policies</h5>
                  <p className="card-text flex-grow-1">Manage shipping and refund policies for the website.</p>
                  <Link to="/admin/policies" className="btn btn-primary mt-auto">Manage Policies</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
