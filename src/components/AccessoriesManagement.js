import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Header from './Header';
import Footer from './Footer';

const AccessoriesManagement = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [accessories, setAccessories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilteredCategory(category);
    }
    fetchAccessories();
    fetchCategories();
  }, [location.search]);

  const fetchAccessories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/accessories`);
      const data = await response.json();
      setAccessories(data.accessories);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch accessories');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAccessory ? `${API_BASE_URL}/api/accessories/${editingAccessory._id}` : `${API_BASE_URL}/api/accessories`;
      const method = editingAccessory ? 'PUT' : 'POST';

      // Create FormData for file upload
      const formDataObj = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key]);
      });

      // Add image files
      if (imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formDataObj.append('images', file);
        });
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formDataObj
      });

      if (response.ok) {
        fetchAccessories();
        resetForm();
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save accessory');
      }
    } catch (err) {
      setError('Failed to save accessory');
    }
  };

  const handleEdit = (accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      description: accessory.description,
      price: accessory.price,
      stock: accessory.stock
    });
    setImageFiles([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this accessory?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accessories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          fetchAccessories();
        } else {
          setError('Failed to delete accessory');
        }
      } catch (err) {
        setError('Failed to delete accessory');
      }
    }
  };

  const resetForm = () => {
    setEditingAccessory(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: ''
    });
    setImageFiles([]);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Accessories Management {filteredCategory && `- ${filteredCategory}`}</h1>
            <div>
              <Link to="/admin/accessories" className="btn btn-secondary me-2">All Accessories</Link>
              <Link to="/admin" className="btn btn-secondary">Back to Admin Panel</Link>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Accessories List</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessories.map(accessory => (
                          <tr key={accessory._id}>
                            <td>{accessory.name}</td>
                            <td>{typeof accessory.category === 'object' && accessory.category ? accessory.category.name : accessory.category}</td>
                            <td>${accessory.price}</td>
                            <td>{accessory.stock}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEdit(accessory)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(accessory._id)}
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
                  <h5 className="mb-0">{editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}</h5>
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
                      <label className="form-label">Images</label>
                      <input
                        type="file"
                        className="form-control"
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {imageFiles.length > 0 && (
                        <div className="mt-2">
                          <small className="text-muted">Selected files: {imageFiles.length}</small>
                        </div>
                      )}
                      {editingAccessory && editingAccessory.images && editingAccessory.images.length > 0 && (
                        <div className="mt-2">
                          <label className="form-label d-block text-muted">Current Images:</label>
                          <div className="row">
                            {editingAccessory.images.map((img, idx) => (
                              <div key={idx} className="col-4 mb-2">
                                <img
                                  src={`${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`}
                                  alt="Current"
                                  className="img-thumbnail"
                                  style={{ width: '100%', height: '50px', objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {editingAccessory && editingAccessory.image && (!editingAccessory.images || editingAccessory.images.length === 0) && (
                        <div className="mt-2">
                          <label className="form-label d-block text-muted">Current Image:</label>
                          <img
                            src={`${API_BASE_URL}${editingAccessory.image.startsWith('/') ? '' : '/'}${editingAccessory.image}`}
                            alt="Current"
                            className="img-thumbnail"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
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
                        {editingAccessory ? 'Update Accessory' : 'Add Accessory'}
                      </button>
                      {editingAccessory && (
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

export default AccessoriesManagement;
