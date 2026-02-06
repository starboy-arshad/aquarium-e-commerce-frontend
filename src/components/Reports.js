import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products for count and low stock
      const productsRes = await fetch('/api/products?pageNumber=1&pageSize=1000');
      const productsData = await productsRes.json();

      // Fetch orders for count and revenue
      const ordersRes = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const ordersData = await ordersRes.json();

      // Fetch users
      const usersRes = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const usersData = await usersRes.json();

      // Calculate stats
      const totalProducts = productsData.products ? productsData.products.length : 0;
      const lowStockProducts = productsData.products ? productsData.products.filter(p => p.stock < 10).length : 0;
      const totalOrders = ordersData.length;
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
      const totalUsers = usersData.length;

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        lowStockProducts
      });
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading reports...</div>;

  return (
    <main className="main">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Reports & Analytics</h1>
          <a href="/admin" className="btn btn-secondary">Back to Admin Panel</a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">{stats.totalProducts}</h5>
                <p className="card-text">Total Products</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">{stats.totalOrders}</h5>
                <p className="card-text">Total Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">{stats.totalUsers}</h5>
                <p className="card-text">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">${stats.totalRevenue.toFixed(2)}</h5>
                <p className="card-text">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Inventory Alerts</h5>
              </div>
              <div className="card-body">
                <div className="alert alert-warning">
                  <strong>Low Stock Items:</strong> {stats.lowStockProducts} products have less than 10 units in stock.
                </div>
                <p>Consider restocking these items to avoid stockouts.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <a href="/admin/products" className="btn btn-outline-primary">View All Products</a>
                  <a href="/admin/orders" className="btn btn-outline-success">View All Orders</a>
                  <a href="/admin/users" className="btn btn-outline-info">View All Users</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reports;
