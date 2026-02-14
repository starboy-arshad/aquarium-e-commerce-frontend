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
    stock: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      // Also update image in formData to reflect a file is selected
      setFormData(prev => ({ ...prev, image: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!selectedFile && !editingProduct && !formData.image) {
      setError('Product image is required');
      return;
    }

    try {
      const url = editingProduct ? `${API_BASE_URL}/api/full-marine-setup/${editingProduct._id}` : `${API_BASE_URL}/api/full-marine-setup`;
      const method = editingProduct ? 'PUT' : 'POST';

      const formDataToSend = new FormData();

      // 1. Add all fields from formData (including 'image' path if it exists)
      Object.keys(formData).forEach(key => {
        // Trim name and description before sending
        if (key === 'name' || key === 'description') {
          formDataToSend.append(key, formData[key].trim());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // 2. Add the new file using 'images' (plural) field name
      // Even if it's one file, the backend patterns here use 'images'
      if (selectedFile) {
        formDataToSend.append('images', selectedFile);
      }

      console.log('Submitting FullMarineSetup (Patterns mode):', {
        url,
        method,
        fields: Array.from(formDataToSend.keys()),
        hasFile: !!selectedFile
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchProducts();
        resetForm();
        setError('');
      } else {
        console.error('Server Validation Error:', responseData);
        setError(responseData.message || `Error (${response.status}): Failed to save product`);
      }
    } catch (err) {
      console.error('Network/Fetch Error:', err);
      setError('Network error: Failed to reach server');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image || (product.images && product.images[0]) || ''
    });
    setPreviewImage('');
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/full-marine-setup/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
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
      stock: '',
      image: ''
    });
    setSelectedFile(null);
    setPreviewImage('');
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
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td>
                              <img
                                src={`${API_BASE_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                                alt={product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock}</td>
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
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewImage && (
                        <div className="mt-2">
                          <img src={previewImage} alt="Preview" className="img-thumbnail" style={{ height: '100px' }} />
                        </div>
                      )}
                      {editingProduct && editingProduct.image && !previewImage && (
                        <div className="mt-2">
                          <label className="d-block text-muted">Current Image:</label>
                          <img src={`${API_BASE_URL}${editingProduct.image.startsWith('/') ? '' : '/'}${editingProduct.image}`} alt="Current" className="img-thumbnail" style={{ height: '100px' }} />
                        </div>
                      )}
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
