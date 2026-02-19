import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import Header from './Header';
import Footer from './Footer';

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
  helpText: {
    display: 'block',
    marginTop: '4px',
    fontSize: '0.75rem',
    color: '#718096',
  },
  currentImagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginTop: '8px',
  },
  currentImg: {
    width: '100%',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  singleCurrentImg: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    marginTop: '8px',
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
    .am-row { flex-direction: column !important; }
    .am-col-list, .am-col-form { flex: 1 1 100% !important; }
    .am-top-bar { flex-direction: column; align-items: flex-start !important; }
    .am-heading { font-size: 1.2rem !important; }
  }

  /* Hide table on mobile, show cards */
  @media (max-width: 480px) {
    .am-table-view { display: none !important; }
    .am-card-view { display: block !important; }
  }
  @media (min-width: 481px) {
    .am-card-view { display: none !important; }
    .am-table-view { display: block !important; }
  }

  /* Mobile accessory cards */
  .am-product-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    background: #fff;
  }
  .am-product-card:last-child { margin-bottom: 0; }
  .am-product-card-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1a202c;
    margin-bottom: 6px;
    word-break: break-word;
  }
  .am-product-card-meta {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #4a5568;
    margin-bottom: 10px;
  }
  .am-product-card-meta span { white-space: nowrap; }
  .am-product-card-actions {
    display: flex;
    gap: 8px;
  }
  .am-product-card-actions button {
    flex: 1;
    padding: 7px 0;
    font-size: 0.82rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .am-btn-secondary-link:hover { background-color: #4a5568 !important; }
  .am-btn-primary:hover { background-color: #2b6cb0 !important; }
  .am-btn-danger:hover { background-color: #c53030 !important; }
  .am-btn-submit:hover { background-color: #2b6cb0 !important; }
  .am-btn-cancel:hover { background-color: #4a5568 !important; }
  .am-input:focus, .am-textarea:focus { border-color: #3182ce !important; box-shadow: 0 0 0 3px rgba(49,130,206,0.15) !important; }
  tr:last-child td { border-bottom: none !important; }
`;

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Show 10 accessories per page

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) setFilteredCategory(category);
    fetchAccessories();
    fetchCategories();
  }, [location.search, currentPage]);

  const fetchAccessories = async () => {
    try {
      // Fetch accessories with pagination
      const response = await fetch(`${API_BASE_URL}/api/accessories?pageNumber=${currentPage}&pageSize=${pageSize}`);
      const data = await response.json();
      
      console.log('Accessories API Response:', data);
      console.log('Accessories:', data.accessories);
      console.log('Pages:', data.pages);
      console.log('Current Page:', currentPage);
      console.log('Accessories Count:', data.accessories ? data.accessories.length : 0);
      
      // Handle different response formats
      let accessories = [];
      let totalPages = 1;
      
      if (data.accessories) {
        accessories = data.accessories;
      } else if (Array.isArray(data)) {
        // If API returns array directly
        accessories = data;
      }
      
      if (data.pages) {
        totalPages = data.pages;
      } else if (data.totalPages) {
        totalPages = data.totalPages;
      } else if (data.total) {
        // If API uses 'total' instead of 'totalPages'
        totalPages = Math.ceil(data.total / pageSize);
      } else if (data.accessories && data.accessories.length === 0 && currentPage > 1) {
        // If we're on a page with no accessories, go back to previous page
        setCurrentPage(prev => Math.max(1, prev - 1));
        return;
      } else {
        // Calculate totalPages based on accessories length if not provided
        totalPages = Math.ceil(accessories.length / pageSize) || 1;
      }
      
      setAccessories(accessories);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching accessories:', err);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAccessory
        ? `${API_BASE_URL}/api/accessories/${editingAccessory._id}`
        : `${API_BASE_URL}/api/accessories`;
      const method = editingAccessory ? 'PUT' : 'POST';

      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => formDataObj.append(key, formData[key]));
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => formDataObj.append('images', file));
      }

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${user.token}` },
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
          headers: { 'Authorization': `Bearer ${user.token}` },
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
    setFormData({ name: '', description: '', price: '', stock: '' });
    setImageFiles([]);
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.pageWrapper}>
      <style>{cssString}</style>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>

          {/* Top Bar */}
          <div style={styles.topBar} className="am-top-bar">
            <h1 style={styles.heading} className="am-heading">
              Accessories Management {filteredCategory && `— ${filteredCategory}`}
            </h1>
            <div style={styles.btnGroup}>
              <Link to="/admin/accessories" style={styles.btnSecondaryLink} className="am-btn-secondary-link">
                All Accessories
              </Link>
              <Link to="/admin" style={styles.btnSecondaryLink} className="am-btn-secondary-link">
                Back to Admin Panel
              </Link>
            </div>
          </div>

          {error && <div style={styles.alert}>{error}</div>}

          {/* Main Row */}
          <div style={styles.row} className="am-row">

            {/* Accessories List */}
            <div style={styles.colList} className="am-col-list">
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h5 style={styles.cardHeaderTitle}>Accessories List</h5>
                </div>
                <div style={styles.cardBody}>

                  {/* Desktop/Tablet: Table */}
                  <div className="am-table-view" style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Price</th>
                          <th style={styles.th}>Stock</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessories.map(accessory => (
                          <tr key={accessory._id}>
                            <td style={styles.td}>{accessory.name}</td>
                            <td style={styles.td}>
                              {typeof accessory.category === 'object' && accessory.category
                                ? accessory.category.name
                                : accessory.category}
                            </td>
                            <td style={styles.td}>₹{accessory.price}</td>
                            <td style={styles.td}>{accessory.stock}</td>
                            <td style={styles.td}>
                              <div style={styles.actionCell}>
                                <button style={styles.btnPrimary} className="am-btn-primary" onClick={() => handleEdit(accessory)}>Edit</button>
                                <button style={styles.btnDanger} className="am-btn-danger" onClick={() => handleDelete(accessory._id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile (≤480px): Card List */}
                  <div className="am-card-view">
                    {accessories.map(accessory => (
                      <div key={accessory._id} className="am-product-card">
                        <div className="am-product-card-name">{accessory.name}</div>
                        <div className="am-product-card-meta">
                          <span>
                            <strong>Category:</strong>{' '}
                            {typeof accessory.category === 'object' && accessory.category
                              ? accessory.category.name
                              : accessory.category}
                          </span>
                          <span><strong>Price:</strong> ₹{accessory.price}</span>
                          <span><strong>Stock:</strong> {accessory.stock}</span>
                        </div>
                        <div className="am-product-card-actions">
                          <button style={{ backgroundColor: '#3182ce', color: '#fff' }} onClick={() => handleEdit(accessory)}>Edit</button>
                          <button style={{ backgroundColor: '#e53e3e', color: '#fff' }} onClick={() => handleDelete(accessory._id)}>Delete</button>
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
                              fetchAccessories();
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
                        fetchAccessories();
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
                        fetchAccessories();
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
            <div style={styles.colForm} className="am-col-form">
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h5 style={styles.cardHeaderTitle}>
                    {editingAccessory ? 'Edit Accessory' : 'Add New Accessory'}
                  </h5>
                </div>
                <div style={styles.cardBody}>
                  <form onSubmit={handleSubmit}>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Name</label>
                      <input
                        type="text"
                        style={styles.input}
                        className="am-input"
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
                        className="am-textarea"
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
                        className="am-input"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Images</label>
                      <input
                        type="file"
                        style={styles.fileInput}
                        name="images"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {imageFiles.length > 0 && (
                        <span style={styles.helpText}>Selected files: {imageFiles.length}</span>
                      )}

                      {/* Current multiple images when editing */}
                      {editingAccessory && editingAccessory.images && editingAccessory.images.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <span style={styles.labelMuted}>Current Images:</span>
                          <div style={styles.currentImagesGrid}>
                            {editingAccessory.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={`${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`}
                                alt="Current"
                                style={styles.currentImg}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current single image fallback when editing */}
                      {editingAccessory && editingAccessory.image &&
                        (!editingAccessory.images || editingAccessory.images.length === 0) && (
                          <div style={{ marginTop: '8px' }}>
                            <span style={styles.labelMuted}>Current Image:</span>
                            <img
                              src={`${API_BASE_URL}${editingAccessory.image.startsWith('/') ? '' : '/'}${editingAccessory.image}`}
                              alt="Current"
                              style={styles.singleCurrentImg}
                            />
                          </div>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Stock</label>
                      <input
                        type="number"
                        style={styles.input}
                        className="am-input"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div style={styles.formActions}>
                      <button type="submit" style={styles.btnSubmit} className="am-btn-submit">
                        {editingAccessory ? 'Update Accessory' : 'Add Accessory'}
                      </button>
                      {editingAccessory && (
                        <button type="button" style={styles.btnCancel} className="am-btn-cancel" onClick={resetForm}>
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