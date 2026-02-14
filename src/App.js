import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import BannerGroup from './components/BannerGroup';

import CategoryPage from './components/CategoryPage';
import ShopPage from './components/ShopPage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminPanel from './components/AdminPanel';
import ProductManagement from './components/ProductManagement';
import FullMarineSetupManagement from './components/FullMarineSetupManagement';
import FullMarineSetupPage from './components/FullMarineSetupPage';
import CategoryManagement from './components/CategoryManagement';
import AccessoriesPage from './components/AccessoriesPage';
import AccessoryPage from './components/AccessoryPage';
import AccessoriesManagement from './components/AccessoriesManagement';
import OrderManagement from './components/OrderManagement';
import OrderDetails from './components/OrderDetails';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import PolicyManagement from './components/PolicyManagement';
import ContactPage from './components/ContactPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AccountPage from './components/AccountPage';
import AboutUs from './components/AboutUs';
import PoliciesPage from './components/PoliciesPage';
import Loading from './components/Loading';
import './App.css';

function HomePage() {
  return (
    <main className="main" style={{ paddingTop: '100px' }}>
      <HeroSlider key="hero-slider" />
      <BannerGroup />
      <CategoryPage />
    </main>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hideLoading = () => {
      setIsLoading(false);
    };

    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      window.addEventListener('load', hideLoading);
    }

    // Fallback timeout in case load event doesn't fire properly
    const fallbackTimeout = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      window.removeEventListener('load', hideLoading);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        {isLoading && <Loading />}
        <Router>
          <Routes>
          <Route path="/" element={
            <div className="page-wrapper">
              <Header />
              <HomePage />
              <Footer />
            </div>
          } />
          <Route path="/shop" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <ShopPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/product/:id" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '20px' }}>
                <ProductPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/cart" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <CartPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/checkout" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <Checkout />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/order-success" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <OrderSuccess />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/order/:orderId" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <OrderDetails />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/full-marine-setup" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <FullMarineSetupPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/accessories" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <AccessoriesPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/accessory/:id" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <AccessoryPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '0px' }}>
                <ContactPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <AboutUs />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/policies" element={
            <div className="page-wrapper">
              <Header />
              <main className="main" style={{ paddingTop: '100px' }}>
                <PoliciesPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          } />
          <Route path="/admin/products" element={
            <AdminLayout>
              <ProductManagement />
            </AdminLayout>
          } />
          <Route path="/admin/categories" element={
            <AdminLayout>
              <CategoryManagement />
            </AdminLayout>
          } />
          <Route path="/admin/full-marine-setup" element={
            <AdminLayout>
              <FullMarineSetupManagement />
            </AdminLayout>
          } />
          <Route path="/admin/accessories" element={
            <AdminLayout>
              <AccessoriesManagement />
            </AdminLayout>
          } />
          <Route path="/admin/orders" element={
            <AdminLayout>
              <OrderManagement />
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          } />
          <Route path="/admin/reports" element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          } />
          <Route path="/admin/policies" element={
            <AdminLayout>
              <PolicyManagement />
            </AdminLayout>
          } />
        </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
