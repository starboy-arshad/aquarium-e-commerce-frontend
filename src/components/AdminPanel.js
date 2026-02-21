import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const prodRes = await fetch(`${API_BASE_URL}/api/products?pageSize=1000`);
      const prodData = await prodRes.json();

      // Fetch Orders
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const orderData = await orderRes.json();

      // Fetch Users
      const userRes = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const userData = await userRes.json();

      const products = prodData.products || [];
      const orders = Array.isArray(orderData) ? orderData : [];
      const users = Array.isArray(userData) ? userData : [];

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
        lowStock: products.filter(p => p.stock < 10).length,
        recentOrders: orders.slice(0, 5).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      });
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [12000, 19000, 15000, 25000, 22000, 30000, stats.totalRevenue / 10], // Simulated trend
        borderColor: '#3182ce',
        backgroundColor: 'rgba(49, 130, 206, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const inventoryData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [stats.totalProducts - stats.lowStock, stats.lowStock, 0],
        backgroundColor: ['#48bb78', '#f6ad55', '#f56565'],
        hoverOffset: 4,
      },
    ],
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <RefreshCw className="spinner-border border-0" size={32} />
    </div>
  );

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 700, margin: 0, color: '#1a202c' }}>Dashboard Overview</h2>
          <p className="text-muted mb-0">Welcome back, {user.name}!</p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-white shadow-sm border rounded-pill px-3">
          <RefreshCw size={16} className="me-2" /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: '#3182ce', trend: '+12.5%', isUp: true },
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: '#48bb78', trend: '+5.2%', isUp: true },
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#805ad5', trend: '+2.1%', isUp: true },
          { label: 'Low Stock', value: stats.lowStock, icon: AlertCircle, color: '#f56565', trend: '-2', isUp: false },
        ].map((item, idx) => (
          <div className="col-md-3 mb-3" key={idx}>
            <div className="card border-0 shadow-sm h-100 p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>{item.label}</small>
                  <h3 className="mt-1 mb-0" style={{ fontWeight: 700 }}>{item.value}</h3>
                </div>
                <div style={{ backgroundColor: `${item.color}15`, color: item.color, padding: '10px', borderRadius: '12px' }}>
                  <item.icon size={24} />
                </div>
              </div>
              <div className="mt-3">
                <span className={item.isUp ? 'text-success' : 'text-danger'} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {item.trend}
                </span>
                <span className="text-muted ms-1" style={{ fontSize: '0.85rem' }}>vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="card-title mb-4 fw-bold">Revenue Analytics</h5>
            <div style={{ height: '300px' }}>
              <Line data={revenueData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="card-title mb-4 fw-bold">Inventory Status</h5>
            <div style={{ height: '250px' }} className="d-flex justify-content-center">
              <Doughnut data={inventoryData} options={{ maintainAspectRatio: false }} />
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <small>Healthy Stock</small>
                <small className="fw-bold">{stats.totalProducts - stats.lowStock}</small>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" style={{ width: `${((stats.totalProducts - stats.lowStock) / stats.totalProducts) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Orders</h5>
              <Link to="/admin/orders" className="btn btn-primary btn-sm rounded-pill d-flex align-items-center px-3">
                View All <ArrowUpRight size={14} className="ms-1" />
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 border-0">Order ID</th>
                    <th className="border-0">Customer</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Amount</th>
                    <th className="border-0">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-3 fw-bold text-primary" data-label="Order ID">#{order._id.slice(-6)}</td>
                        <td data-label="Customer">{order.user?.name || 'Guest'}</td>
                        <td data-label="Status">
                          <span className={`badge rounded-pill ${order.isDelivered ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                            }`} style={{ padding: '6px 12px' }}>
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </td>
                        <td className="fw-bold" data-label="Amount">₹{order.totalPrice.toLocaleString()}</td>
                        <td className="text-muted" data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">No recent orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-success-subtle { background-color: #d1fae5; }
        .bg-warning-subtle { background-color: #fef3c7; }
        .text-success { color: #059669; }
        .text-warning { color: #d97706; }
        .btn-white { background-color: #fff; }

        @media (max-width: 767px) {
          .table thead { display: none; }
          .table tbody tr { display: block; padding: 15px; border-bottom: 8px solid #f8fafc; }
          .table tbody td { display: flex; justify-content: flex-start; align-items: center; border: none; padding: 5px 0; font-size: 0.9rem; }
          .table tbody td::before { content: attr(data-label); width: 100px; font-weight: bold; color: #718096; flex-shrink: 0; font-size: 0.8rem; text-transform: uppercase; }
          
          .card-title { font-size: 1.1rem; }
          h2 { font-size: 1.5rem !important; }
        }

        @media (max-width: 576px) {
          .container-fluid { padding: 0 10px !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
