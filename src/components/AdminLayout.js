import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  ShieldAlert,
  Inbox,
  Settings,
  Fish,
  Waves
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="main">
          <div className="container">
            <div className="text-center mt-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/categories', icon: Layers, label: 'Categories' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/full-marine-setup', icon: Fish, label: 'Marine Setup' },
    { path: '/admin/accessories', icon: Waves, label: 'Accessories' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/inbox', icon: Inbox, label: 'Inbox' },
    { path: '/admin/policies', icon: ShieldAlert, label: 'Policies' },
  ];

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />

      {/* Top Navigation Bar */}
      <nav style={{
        marginTop: '100px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: '100px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }} className="admin-top-nav">
        <div style={{ display: 'flex', maxWidth: '1200px', width: '100%' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 20px',
                  textDecoration: 'none',
                  color: isActive ? '#3182ce' : '#666',
                  borderBottom: isActive ? '3px solid #3182ce' : '3px solid transparent',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  whiteSpace: 'nowrap',
                  gap: '8px'
                }}
                className="admin-nav-link"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
        minHeight: 'calc(100vh - 160px)'
      }}>
        {children}
      </main>

      <Footer />
      <style>{`
        .admin-nav-link:hover {
          color: #3182ce;
          background-color: #f8fafc;
        }
        .admin-top-nav::-webkit-scrollbar {
          height: 4px;
        }
        .admin-top-nav::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @media (max-width: 768px) {
          .admin-nav-link {
            padding: 12px 15px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
