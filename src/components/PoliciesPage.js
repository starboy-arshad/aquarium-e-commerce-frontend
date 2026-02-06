import React, { useState, useEffect } from 'react';

const PoliciesPage = () => {
  const [policies, setPolicies] = useState({
    shippingPolicy: '',
    refundPolicy: '',
    termsAndConditions: '',
    privacyPolicy: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shipping');

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/policies');
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

  if (loading) {
    return (
      <main className="main">
        <div className="container text-center py-5">
          <p>Loading policies...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="page-header text-center" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/shop_card.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="page-title" style={{ color: 'white' }}>Policies</h1>
          <p className="page-subtitle" style={{ color: 'white' }}>Our terms, conditions, and policies</p>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="breadcrumb-nav mb-3">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Policies</li>
          </ol>
        </div>
      </nav>

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="policy-tabs">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
                      onClick={() => setActiveTab('shipping')}
                      href="#shipping"
                      role="tab"
                    >
                      Shipping
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'returns' ? 'active' : ''}`}
                      onClick={() => setActiveTab('returns')}
                      href="#returns"
                      role="tab"
                    >
                      Returns
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'terms' ? 'active' : ''}`}
                      onClick={() => setActiveTab('terms')}
                      href="/Policies#terms"
                      role="tab"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
                      onClick={() => setActiveTab('privacy')}
                      href="/Policies#privacy"
                      role="tab"
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>

                <div className="tab-content mt-4">
                  {activeTab === 'shipping' && (
                    <div className="tab-pane active">
                      <div dangerouslySetInnerHTML={{ __html: policies.shippingPolicy }} />
                    </div>
                  )}
                  {activeTab === 'returns' && (
                    <div className="tab-pane active">
                      <div dangerouslySetInnerHTML={{ __html: policies.refundPolicy }} />
                    </div>
                  )}
                  {activeTab === 'terms' && (
                    <div className="tab-pane active">
                      <div dangerouslySetInnerHTML={{ __html: policies.termsAndConditions }} />
                    </div>
                  )}
                  {activeTab === 'privacy' && (
                    <div className="tab-pane active">
                      <div dangerouslySetInnerHTML={{ __html: policies.privacyPolicy }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PoliciesPage;