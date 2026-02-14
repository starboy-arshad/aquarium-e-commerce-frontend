import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Header from './Header';
import Footer from './Footer';

const CategoryManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch categories');
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

    // Validate required fields
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      const url = editingCategory ? `${API_BASE_URL}/api/categories/${editingCategory._id}` : `${API_BASE_URL}/api/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      console.log('Sending form data:', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        hasImage: !!formData.image
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formDataToSend
      });

      if (response.ok) {
        fetchCategories();
        resetForm();
        setError('');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(errorData.message || `Failed to save category (${response.status})`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network error: ${err.message}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        console.log('User state:', user);
        console.log('User token:', user?.token);
        console.log('Is admin:', user?.isAdmin);

        if (!user || !user.token) {
          setError('You must be logged in to delete categories');
          return;
        }

        if (!user.isAdmin) {
          setError('You must be an admin to delete categories');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          fetchCategories();
          setError('');
        } else {
          const errorData = await response.json();
          console.error('Delete error:', errorData);
          setError(errorData.message || 'Failed to delete category');
        }
      } catch (err) {
        console.error('Delete error:', err);
        setError('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Category Management</h1>
            <Link to="/admin" className="btn btn-secondary">Back to Admin Panel</Link>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Categories List</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(category => (
                          <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() => handleEdit(category)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(category._id)}
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
                  <h5 className="mb-0">{editingCategory ? 'Edit Category' : 'Add New Category'}</h5>
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
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
                      />
                      {editingCategory && editingCategory.image && (
                        <div className="mt-2">
                          <small className="text-muted">Current image: {editingCategory.image}</small>
                        </div>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        {editingCategory ? 'Update Category' : 'Add Category'}
                      </button>
                      {editingCategory && (
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

export default CategoryManagement;
