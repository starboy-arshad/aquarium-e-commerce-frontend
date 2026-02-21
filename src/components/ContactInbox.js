import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';
import { Mail, Phone, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';

const ContactInbox = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(Array.isArray(data) ? data : (data.messages || []));
            } else {
                setError('Failed to fetch messages. The endpoint might not be available yet.');
            }
        } catch (err) {
            setError('Error connecting to Server');
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                setMessages(messages.filter(msg => msg._id !== id));
                if (selectedMessage?._id === id) setSelectedMessage(null);
            }
        } catch (err) {
            alert('Failed to delete message');
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontWeight: 700, margin: 0 }}>Contact Inbox</h2>
                <button onClick={fetchMessages} className="btn btn-outline-primary btn-sm">Refresh</button>
            </div>

            {error && <div className="alert alert-warning">{error}</div>}

            <div className="row">
                {/* Messages List */}
                <div className="col-lg-4">
                    <div className="card shadow-sm" style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                        <div className="list-group list-group-flush">
                            {messages.length === 0 ? (
                                <div className="p-4 text-center text-muted">No messages found.</div>
                            ) : (
                                messages.map((msg) => (
                                    <button
                                        key={msg._id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`list-group-item list-group-item-action border-0 p-3 ${selectedMessage?._id === msg._id ? 'bg-light' : ''}`}
                                        style={{ borderLeft: selectedMessage?._id === msg._id ? '4px solid #3182ce' : '4px solid transparent' }}
                                    >
                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>{msg.name}</h6>
                                            <small className="text-muted"><Clock size={12} className="me-1" /> {new Date(msg.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <p className="small text-muted mb-0 text-truncate">{msg.subject || 'No Subject'}</p>
                                        <p className="small text-muted mb-0 text-truncate">{msg.message}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Message Content */}
                <div className="col-lg-8">
                    {selectedMessage ? (
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                <div>
                                    <h5 className="mb-0">{selectedMessage.subject || 'Message Detail'}</h5>
                                    <small className="text-muted">{new Date(selectedMessage.createdAt).toLocaleString()}</small>
                                </div>
                                <button onClick={() => deleteMessage(selectedMessage._id)} className="btn btn-link text-danger p-0">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light p-2 rounded me-3 text-primary"><Mail size={18} /></div>
                                            <div>
                                                <small className="text-muted d-block uppercase font-weight-bold">Email</small>
                                                <span>{selectedMessage.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light p-2 rounded me-3 text-success"><Phone size={18} /></div>
                                            <div>
                                                <small className="text-muted d-block uppercase font-weight-bold">Phone</small>
                                                <span>{selectedMessage.phone || 'Not provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="mt-4">
                                    <h6 className="text-muted mb-3 font-weight-bold">Message:</h6>
                                    <div className="p-4 bg-light rounded" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-white border-top-0 py-3">
                                <a href={`mailto:${selectedMessage.email}`} className="btn btn-primary">
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="card shadow-sm h-100 d-flex justify-content-center align-items-center text-muted p-5">
                            <div className="text-center">
                                <Mail size={48} className="mb-3 opacity-25" />
                                <p>Select a message to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactInbox;
