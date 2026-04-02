import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('admin_auth') === 'true') {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password })
            });
            const data = await res.json();
            
            if (data.success) {
                localStorage.setItem('admin_auth', 'true');
                localStorage.setItem('admin_token', data.token);
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid Admin Credentials');
            }
        } catch (err) {
            setError('Server connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper fade-in">
            <div className="login-container">
                <div className="login-sidebar">
                    <div className="sidebar-content">
                        <div className="sec-badge">
                            <span className="dot"></span> Secure Connection
                        </div>
                        <h2>Command Center</h2>
                        <p>Access the unified dashboard to monitor traffic, manage incoming inquiries, and track portfolio insights.</p>
                        <div className="sys-info">
                            <div className="info-item">
                                <span className="label">Status</span>
                                <span className="value success">Operational</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Environment</span>
                                <span className="value">Production</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-main">
                    <div className="login-header">
                        <h2>Admin Authentication</h2>
                        <p>Enter your credentials to access the system.</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin@portfolio.com"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="form-submit">
                            <button type="button" onClick={() => navigate('/')} className="btn-back">Return to Site</button>
                            <button type="submit" className="btn-auth" disabled={loading}>
                                {loading ? 'Authenticating...' : 'Authenticate'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .admin-login-wrapper {
                    min-height: 100vh;
                    background: #030712;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 24px;
                }
                .login-container {
                    background: #0f172a;
                    border: 1px solid #1e293b;
                    border-radius: 20px;
                    display: flex;
                    max-width: 900px;
                    width: 100%;
                    min-height: 500px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden;
                }
                .login-sidebar {
                    flex: 1;
                    background: linear-gradient(180deg, rgba(30, 58, 138, 0.1) 0%, rgba(3, 7, 18, 0.5) 100%), #0f172a;
                    border-right: 1px solid #1e293b;
                    padding: 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .sec-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                    padding: 6px 12px;
                    border-radius: 100px;
                    margin-bottom: 32px;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    width: fit-content;
                }
                .sec-badge .dot {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #10b981;
                }
                .sidebar-content h2 {
                    color: #f8fafc;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 16px;
                }
                .sidebar-content p {
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 48px;
                }
                .sys-info {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    border-top: 1px solid #1e293b;
                    padding-top: 24px;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.875rem;
                }
                .info-item .label { color: #64748b; }
                .info-item .value { color: #e2e8f0; font-weight: 600; }
                .info-item .value.success { color: #10b981; }

                .login-main {
                    flex: 1.2;
                    padding: 64px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background: #0b1120;
                }
                .login-header h2 {
                    color: #f8fafc;
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .login-header p {
                    color: #64748b;
                    font-size: 0.9375rem;
                    margin-bottom: 40px;
                }
                
                .form-group { margin-bottom: 24px; position: relative; }
                .form-group label {
                    display: block;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #cbd5e1;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-group input {
                    width: 100%;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 12px;
                    padding: 16px 20px;
                    color: #f8fafc;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s ease;
                    box-sizing: border-box;
                }
                .form-group input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                }
                
                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 24px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .form-submit {
                    display: flex;
                    gap: 16px;
                    margin-top: 40px;
                }
                .btn-auth {
                    flex: 1;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-auth:hover { background: #2563eb; transform: translateY(-1px); }
                
                .btn-back {
                    flex: 1;
                    background: transparent;
                    color: #94a3b8;
                    border: 1px solid #334155;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-back:hover { color: #f8fafc; border-color: #64748b; background: rgba(255,255,255,0.02); }

                @media (max-width: 768px) {
                    .login-container { flex-direction: column; }
                    .login-sidebar { padding: 32px; border-right: none; border-bottom: 1px solid #1e293b; }
                    .login-main { padding: 32px; }
                }

                .fade-in { animation: fadeIn 0.6s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminLogin;
