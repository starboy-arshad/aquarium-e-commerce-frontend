import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Header from './Header';
import Footer from './Footer';

const FullMarineSetupManagement = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/full-marine-setup`);
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `${API_BASE_URL}/api/full-marine-setup/${editingProduct._id}` : `${API_BASE_URL}/api/full-marine-setup`;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/full-marine-setup/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchProducts();
        } else {
          setError('Failed to delete product');
        }
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      stock: ''
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Full Marine Setup Management</h1>
            <div>
              <Link to="/full-marine-setup" className="btn btn-primary me-2">View in Shop</Link>
              <Link to="/admin" className="btn btn-secondary">Back to Admin Panel</Link>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Products List</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>{product.rating}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEdit(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingProduct && (
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
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

export default FullMarineSetupManagement;
