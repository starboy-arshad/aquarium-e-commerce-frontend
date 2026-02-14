import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    const action = currentAdminStatus ? 'remove admin privileges from' : 'grant admin privileges to';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ isAdmin: !currentAdminStatus }),
        });
        if (response.ok) {
          fetchUsers(); // Refresh users
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to update user');
        }
      } catch (err) {
        setError('Failed to update user');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading users...</div>;

  return (
    <main className="main">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>User Management</h1>
          <a href="/admin" className="btn btn-secondary">Back to Admin Panel</a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">All Users</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u._id.substring(0, 8)}...</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.isAdmin ? (
                          <span className="badge bg-success">Admin</span>
                        ) : (
                          <span className="badge bg-secondary">User</span>
                        )}
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.isAdmin ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                        >
                          {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
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
    </main>
  );
};

export default UserManagement;
