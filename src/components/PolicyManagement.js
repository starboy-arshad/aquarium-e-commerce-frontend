import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import AdminLayout from './AdminLayout';
import DOMPurify from 'dompurify';

const PolicyManagement = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState({ shippingPolicy: '', refundPolicy: '', termsAndConditions: '', privacyPolicy: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/policies`);
      if (response.ok) {
        const data = await response.json();
        setPolicies(data);
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/policies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(policies)
      });

      if (response.ok) {
        setMessage('Policies updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update policies');
      }
    } catch (error) {
      console.error('Failed to save policies:', error);
      setMessage('Error saving policies');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center">
          <p>Loading policies...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container" style={{ paddingTop: '100px' }}>
        <h1 className="mb-4">Policy Management</h1>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-4`}>
            {message}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Shipping Policy</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="12"
                  value={policies.shippingPolicy}
                  onChange={(e) => setPolicies({ ...policies, shippingPolicy: e.target.value })}
                  placeholder="Enter shipping policy HTML content..."
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Refund Policy</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="12"
                  value={policies.refundPolicy}
                  onChange={(e) => setPolicies({ ...policies, refundPolicy: e.target.value })}
                  placeholder="Enter refund policy HTML content..."
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Terms and Conditions</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="12"
                  value={policies.termsAndConditions}
                  onChange={(e) => setPolicies({ ...policies, termsAndConditions: e.target.value })}
                  placeholder="Enter terms and conditions HTML content..."
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Privacy Policy</h5>
              </div>
              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="12"
                  value={policies.privacyPolicy}
                  onChange={(e) => setPolicies({ ...policies, privacyPolicy: e.target.value })}
                  placeholder="Enter privacy policy HTML content..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Policies'}
          </button>
        </div>

        <div className="mt-4">
          <h4>Preview:</h4>
          <div className="border p-3">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.shippingPolicy) }} />
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.refundPolicy) }} />
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.termsAndConditions) }} />
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policies.privacyPolicy) }} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PolicyManagement;