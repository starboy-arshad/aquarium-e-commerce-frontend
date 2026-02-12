import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';

const ProductManagement = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    additionalInfo: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilteredCategory(category);
    }
    fetchProducts();
    fetchCategories();
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/products');
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://p01--backend--fbt2wjdzbm9v.code.run/api/categories');
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs for the selected files
    const fileURLs = files.map(file => URL.createObjectURL(file));
    setPreviewImages(fileURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      // Create FormData for file upload
      const formDataWithFiles = new FormData();
      
      // Add form fields to FormData
      Object.keys(formData).forEach(key => {
        formDataWithFiles.append(key, formData[key]);
      });

      // Add files to FormData
      selectedFiles.forEach((file, index) => {
        formDataWithFiles.append('images', file);
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formDataWithFiles
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
      category: product.category._id,
      image: product.image,
      stock: product.stock,
      additionalInfo: product.additionalInfo || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
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
      category: '',
      image: '',
      stock: '',
      additionalInfo: ''
    });
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Product Management {filteredCategory && `- ${filteredCategory}`}</h1>
            <div>
              <Link to="/admin/products" className="btn btn-secondary me-2">All Products</Link>
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
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td>
                              {product.images && product.images.length > 0 && (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                />
                              )}
                              {product.name}
                            </td>
                            <td>{typeof product.category === 'object' && product.category ? product.category.name : product.category}</td>
                            <td>${product.price}</td>
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
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                        {filteredCategory && !categories.find(cat => cat.name === filteredCategory) && (
                          <option value={filteredCategory}>{filteredCategory}</option>
                        )}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Product Images</label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="mt-2">
                        <small className="text-muted">Select up to 5 images (max 5MB each)</small>
                      </div>
                    </div>
                    
                    {/* Image Preview */}
                    {previewImages.length > 0 && (
                      <div className="mb-3">
                        <label className="form-label">Image Preview</label>
                        <div className="row">
                          {previewImages.map((url, index) => (
                            <div key={index} className="col-md-4 mb-2">
                              <img 
                                src={url} 
                                alt={`Preview ${index + 1}`}
                                className="img-thumbnail"
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show existing images when editing */}
                    {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                      <div className="mb-3">
                        <label className="form-label">Current Images</label>
                        <div className="row">
                          {editingProduct.images.map((image, index) => (
                            <div key={index} className="col-md-4 mb-2">
                              <img 
                                src={image} 
                                alt={`Current ${index + 1}`}
                                className="img-thumbnail"
                                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <div className="mb-3">
                      <label className="form-label">Additional Information</label>
                      <textarea
                        className="form-control"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter additional product information..."
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

export default ProductManagement;
