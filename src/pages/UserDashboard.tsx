import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user_auth') !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user_auth');
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
            <div className="admin-dashboard fade-in">
                <div className="dashboard-header">
                    <h2>User <span className="gradient-text">Dashboard</span></h2>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/')} className="btn btn-secondary btn-small" style={{ textDecoration: 'none' }}>View Portfolio</button>
                        <button onClick={handleLogout} className="btn btn-primary btn-small" style={{ background: 'var(--text-color)', color: 'var(--bg-color)' }}>Log out</button>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-icon">📂</div>
                        <div className="card-info">
                            <h3>Saved Projects</h3>
                            <p className="stat">3</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-icon">💬</div>
                        <div className="card-info">
                            <h3>Messages Sent</h3>
                            <p className="stat">1</p>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="card-icon">🔔</div>
                        <div className="card-info">
                            <h3>Notifications</h3>
                            <p className="stat" style={{ color: '#3b82f6', fontSize: '1.5rem' }}>2 Unread</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-card full-width">
                        <h3>My Inquiries</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Date Sent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Project Collaboration Details</td>
                                        <td>Oct 12, 2025</td>
                                        <td><span className="status-badge pending">Pending Reply</span></td>
                                    </tr>
                                    <tr>
                                        <td>Resume Request</td>
                                        <td>Sep 28, 2025</td>
                                        <td><span className="status-badge active">Responded</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <style>{`
                    .admin-dashboard { padding: 80px 20px 60px; max-width: 1200px; margin: 0 auto; }
                    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); }
                    .dashboard-header h2 { font-size: 2.5rem; font-weight: 800; }
                    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 40px; }
                    .dashboard-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; display: flex; align-items: center; gap: 24px; transition: var(--transition); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                    .dashboard-card:hover { border-color: var(--primary); transform: translateY(-5px); }
                    .dashboard-card.full-width { display: block; grid-column: 1 / -1; }
                    .card-icon { font-size: 2.5rem; width: 64px; height: 64px; border-radius: 16px; background: rgba(139, 92, 246, 0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                    .card-info h3 { font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 8px; font-weight: 500; }
                    .card-info .stat { font-size: 2.5rem; font-weight: 800; color: var(--text-color); margin: 0; }
                    .dashboard-content h3 { font-size: 1.75rem; margin-bottom: 24px; font-weight: 700; }
                    .admin-table { width: 100%; border-collapse: collapse; min-width: 500px; }
                    .admin-table th, .admin-table td { padding: 16px; text-align: left; border-bottom: 1px solid var(--border-color); }
                    .admin-table th { color: var(--text-secondary); font-weight: 600; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
                    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
                    .status-badge { padding: 6px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; }
                    .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                    @media (max-width: 768px) {
                        .dashboard-header { flex-direction: column; align-items: flex-start; gap: 24px; }
                        .dashboard-header h2 { font-size: 2rem; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default UserDashboard;
