import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Header from './Header';

const paginationStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
    marginTop: '16px',
  },
  info: {
    fontSize: '0.9rem',
    color: '#4a5568',
    fontWeight: 500,
  },
  controls: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '8px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#fff',
    color: '#4a5568',
  },
  activeButton: {
    backgroundColor: '#3182ce',
    color: '#fff',
    border: '1px solid #3182ce',
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#f7fafc',
    color: '#a0aec0',
    border: '1px solid #e2e8f0',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  pageButton: {
    minWidth: '40px',
    textAlign: 'center',
  },
  activePageButton: {
    backgroundColor: '#3182ce',
    color: '#fff',
    border: '1px solid #3182ce',
    fontWeight: 600,
  },
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    color: '#2d3748',
  },
  main: {
    flex: 1,
    paddingTop: '100px',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    margin: 0,
    color: '#1a202c',
  },
  btnGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  btnPrimaryLink: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#3182ce',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnSecondaryLink: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#718096',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  alert: {
    padding: '12px 16px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '6px',
    marginBottom: '20px',
    border: '1px solid #fc8181',
    fontSize: '0.9rem',
  },
  row: {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  colList: {
    flex: '2 1 500px',
    minWidth: 0,
  },
  colForm: {
    flex: '1 1 300px',
    minWidth: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  cardHeader: {
    padding: '14px 20px',
    backgroundColor: '#edf2f7',
    borderBottom: '1px solid #e2e8f0',
  },
  cardHeaderTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#2d3748',
  },
  cardBody: {
    padding: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
  },
  th: {
    padding: '10px 12px',
    backgroundColor: '#f7fafc',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'left',
    fontWeight: 600,
    color: '#4a5568',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #edf2f7',
    verticalAlign: 'middle',
    color: '#4a5568',
  },
  tdFlex: {
    padding: '10px 12px',
    borderBottom: '1px solid #edf2f7',
    verticalAlign: 'middle',
    color: '#4a5568',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  thumbImg: {
    width: '44px',
    height: '44px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0,
  },
  actionCell: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '5px 12px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnDanger: {
    padding: '5px 12px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#4a5568',
  },
  labelMuted: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '0.8rem',
    color: '#718096',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#2d3748',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#2d3748',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  fileInput: {
    width: '100%',
    padding: '6px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#2d3748',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  previewImg: {
    height: '100px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    marginTop: '8px',
    objectFit: 'cover',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  btnSubmit: {
    padding: '9px 20px',
    backgroundColor: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  btnCancel: {
    padding: '9px 20px',
    backgroundColor: '#718096',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loading: {
    textAlign: 'center',
    marginTop: '60px',
    fontSize: '1rem',
    color: '#718096',
  },
};

const cssString = `
  @media (max-width: 768px) {
    .fms-row { flex-direction: column !important; }
    .fms-col-list, .fms-col-form { flex: 1 1 100% !important; }
    .fms-top-bar { flex-direction: column; align-items: flex-start !important; }
    .fms-heading { font-size: 1.2rem !important; }
  }

  /* Hide table on mobile, show cards */
  @media (max-width: 480px) {
    .fms-table-view { display: none !important; }
    .fms-card-view { display: block !important; }
  }
  @media (min-width: 481px) {
    .fms-card-view { display: none !important; }
    .fms-table-view { display: block !important; }
  }

  /* Mobile product cards */
  .fms-product-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    background: #fff;
  }
  .fms-product-card:last-child { margin-bottom: 0; }
  .fms-product-card-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .fms-product-card-thumb {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
  }
  .fms-product-card-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1a202c;
    flex: 1;
    word-break: break-word;
  }
  .fms-product-card-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #4a5568;
    margin-bottom: 10px;
  }
  .fms-product-card-meta span { white-space: nowrap; }
  .fms-product-card-actions {
    display: flex;
    gap: 8px;
  }
  .fms-product-card-actions button {
    flex: 1;
    padding: 7px 0;
    font-size: 0.82rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .fms-btn-primary-link:hover { background-color: #2b6cb0 !important; }
  .fms-btn-secondary-link:hover { background-color: #4a5568 !important; }
  .fms-btn-primary:hover { background-color: #2b6cb0 !important; }
  .fms-btn-danger:hover { background-color: #c53030 !important; }
  .fms-btn-submit:hover { background-color: #2b6cb0 !important; }
  .fms-btn-cancel:hover { background-color: #4a5568 !important; }
  .fms-input:focus, .fms-textarea:focus { border-color: #3182ce !important; box-shadow: 0 0 0 3px rgba(49,130,206,0.15) !important; }
  tr:last-child td { border-bottom: none !important; }
`;

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Show 10 products per page

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      // Fetch products with pagination
      const response = await fetch(`${API_BASE_URL}/api/full-marine-setup?pageNumber=${currentPage}&pageSize=${pageSize}`);
      const data = await response.json();

      console.log('Full Marine Setup API Response:', data);
      console.log('Products:', data.products);
      console.log('Pages:', data.pages);
      console.log('Current Page:', currentPage);
      console.log('Products Count:', data.products ? data.products.length : 0);

      // Handle different response formats
      let products = [];
      let totalPages = 1;

      if (data.products) {
        products = data.products;
      } else if (Array.isArray(data)) {
        // If API returns array directly
        products = data;
      }

      if (data.pages) {
        totalPages = data.pages;
      } else if (data.totalPages) {
        totalPages = data.totalPages;
      } else if (data.total) {
        // If API uses 'total' instead of 'totalPages'
        totalPages = Math.ceil(data.total / pageSize);
      } else if (data.products && data.products.length === 0 && currentPage > 1) {
        // If we're on a page with no products, go back to previous page
        setCurrentPage(prev => Math.max(1, prev - 1));
        return;
      } else {
        // Calculate totalPages based on products length if not provided
        totalPages = Math.ceil(products.length / pageSize) || 1;
      }

      setProducts(products);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching full marine setup products:', err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) { setError('Name is required'); return; }
    if (!formData.description.trim()) { setError('Description is required'); return; }
    if (!selectedFile && !editingProduct && !formData.image) { setError('Product image is required'); return; }

    try {
      const url = editingProduct
        ? `${API_BASE_URL}/api/full-marine-setup/${editingProduct._id}`
        : `${API_BASE_URL}/api/full-marine-setup`;
      const method = editingProduct ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'name' || key === 'description') {
          formDataToSend.append(key, formData[key].trim());
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (selectedFile) {
        formDataToSend.append('images', selectedFile);
      }

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (response.ok) {
        fetchProducts();
        resetForm();
        setError('');
      } else {
        setError(responseData.message || `Error (${response.status}): Failed to save product`);
      }
    } catch (err) {
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
          headers: { 'Authorization': `Bearer ${user.token}` },
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
    setFormData({ name: '', description: '', price: '', stock: '', image: '' });
    setSelectedFile(null);
    setPreviewImage('');
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{cssString}</style>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>

          {/* Top Bar */}
          <div style={styles.topBar} className="fms-top-bar">
            <h1 style={styles.heading} className="fms-heading">Full Marine Setup Management</h1>
            <div style={styles.btnGroup}>
              <Link to="/full-marine-setup" style={styles.btnPrimaryLink} className="fms-btn-primary-link">
                View in Shop
              </Link>
              <Link to="/admin" style={styles.btnSecondaryLink} className="fms-btn-secondary-link">
                Back to Admin Panel
              </Link>
            </div>
          </div>

          {error && <div style={styles.alert}>{error}</div>}

          {/* Main Row */}
          <div style={styles.row} className="fms-row">

            {/* Products List */}
            <div style={styles.colList} className="fms-col-list">
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h5 style={styles.cardHeaderTitle}>Products List</h5>
                </div>
                <div style={styles.cardBody}>

                  {/* Desktop/Tablet: Table */}
                  <div className="fms-table-view" style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Image</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Price</th>
                          <th style={styles.th}>Stock</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product._id}>
                            <td style={styles.td}>
                              {(() => {
                                const rawImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
                                const imageSrc = rawImage ? (rawImage.startsWith('http') ? rawImage : `${API_BASE_URL}/${rawImage.startsWith('/') ? rawImage.substring(1) : (rawImage.startsWith('uploads/') ? rawImage : `uploads/${rawImage}`)}`) : '/assets/images/products/product-1.jpg';
                                return (
                                  <img
                                    src={imageSrc}
                                    alt={product.name}
                                    style={styles.thumbImg}
                                    onError={(e) => { e.target.src = '/assets/images/products/product-1.jpg'; }}
                                  />
                                );
                              })()}
                            </td>
                            <td style={styles.td}>{product.name}</td>
                            <td style={styles.td}>₹{product.price}</td>
                            <td style={styles.td}>{product.stock}</td>
                            <td style={styles.td}>
                              <div style={styles.actionCell}>
                                <button style={styles.btnPrimary} className="fms-btn-primary" onClick={() => handleEdit(product)}>Edit</button>
                                <button style={styles.btnDanger} className="fms-btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile (≤480px): Card List */}
                  <div className="fms-card-view">
                    {products.map(product => (
                      <div key={product._id} className="fms-product-card">
                        <div className="fms-product-card-top">
                          {(() => {
                            const rawImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
                            const imageSrc = rawImage ? (rawImage.startsWith('http') ? rawImage : `${API_BASE_URL}/${rawImage.startsWith('/') ? rawImage.substring(1) : (rawImage.startsWith('uploads/') ? rawImage : `uploads/${rawImage}`)}`) : '/assets/images/products/product-1.jpg';
                            return (
                              <img
                                src={imageSrc}
                                alt={product.name}
                                className="fms-product-card-thumb"
                                onError={(e) => { e.target.src = '/assets/images/products/product-1.jpg'; }}
                              />
                            );
                          })()}
                          <span className="fms-product-card-name">{product.name}</span>
                        </div>
                        <div className="fms-product-card-meta">
                          <span><strong>Price:</strong> ₹{product.price}</span>
                          <span><strong>Stock:</strong> {product.stock}</span>
                        </div>
                        <div className="fms-product-card-actions">
                          <button style={{ backgroundColor: '#3182ce', color: '#fff' }} onClick={() => handleEdit(product)}>Edit</button>
                          <button style={{ backgroundColor: '#e53e3e', color: '#fff' }} onClick={() => handleDelete(product._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={paginationStyles.container}>
                  <div style={paginationStyles.info}>
                    Page {currentPage} of {totalPages}
                  </div>
                  <div style={paginationStyles.controls}>
                    <button
                      style={{
                        ...paginationStyles.button,
                        ...(currentPage === 1 ? paginationStyles.disabledButton : paginationStyles.activeButton)
                      }}
                      onClick={() => {
                        setCurrentPage(1);
                      }}
                      disabled={currentPage === 1}
                    >
                      First
                    </button>
                    <button
                      style={{
                        ...paginationStyles.button,
                        ...(currentPage === 1 ? paginationStyles.disabledButton : paginationStyles.activeButton)
                      }}
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    {(() => {
                      const pages = [];
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, currentPage + 2);

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            style={{
                              ...paginationStyles.button,
                              ...paginationStyles.pageButton,
                              ...(i === currentPage ? paginationStyles.activePageButton : paginationStyles.pageButton)
                            }}
                            onClick={() => {
                              setCurrentPage(i);
                            }}
                          >
                            {i}
                          </button>
                        );
                      }
                      return pages;
                    })()}

                    <button
                      style={{
                        ...paginationStyles.button,
                        ...(currentPage === totalPages ? paginationStyles.disabledButton : paginationStyles.activeButton)
                      }}
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                    <button
                      style={{
                        ...paginationStyles.button,
                        ...(currentPage === totalPages ? paginationStyles.disabledButton : paginationStyles.activeButton)
                      }}
                      onClick={() => {
                        setCurrentPage(totalPages);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add / Edit Form */}
            <div style={styles.colForm} className="fms-col-form">
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h5 style={styles.cardHeaderTitle}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h5>
                </div>
                <div style={styles.cardBody}>
                  <form onSubmit={handleSubmit}>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Name</label>
                      <input
                        type="text"
                        style={styles.input}
                        className="fms-input"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        style={styles.textarea}
                        className="fms-textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Price</label>
                      <input
                        type="number"
                        style={styles.input}
                        className="fms-input"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Product Image</label>
                      <input
                        type="file"
                        style={styles.fileInput}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewImage && (
                        <img src={previewImage} alt="Preview" style={styles.previewImg} />
                      )}
                      {editingProduct && editingProduct.image && !previewImage && (
                        <div style={{ marginTop: '8px' }}>
                          <span style={styles.labelMuted}>Current Image:</span>
                          <img
                            src={`${API_BASE_URL}${editingProduct.image.startsWith('/') ? '' : '/'}${editingProduct.image}`}
                            alt="Current"
                            style={styles.previewImg}
                          />
                        </div>
                      )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Stock</label>
                      <input
                        type="number"
                        style={styles.input}
                        className="fms-input"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div style={styles.formActions}>
                      <button type="submit" style={styles.btnSubmit} className="fms-btn-submit">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      {editingProduct && (
                        <button type="button" style={styles.btnCancel} className="fms-btn-cancel" onClick={resetForm}>
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
    </div>
  );
};

export default FullMarineSetupManagement;