import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user_auth') === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mock generic user authentication logic
        if (email && password.length >= 6) {
            localStorage.setItem('user_auth', 'true');
            navigate('/dashboard');
        } else {
            setError('Please enter a valid email and 6+ character password');
        }
    };

    return (
        <div className="admin-login-container fade-in" style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glow-bg">
                <div className="blob blob-2"></div><div className="blob blob-4"></div>
            </div>
            <div className="login-card" style={{ zIndex: 10 }}>
                <div className="login-header">
                    <div className="icon">👤</div>
                    <h2>User  Login</h2>
                    <p>Welcome back! Please login to your account</p>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            required
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>Access Dashboard</button>
                    <button type="button" onClick={() => navigate('/')} className="back-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>← Back to Portfolio</button>
                </form>
            </div>
            <style>{`
                .admin-login-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; position: relative; z-index: 10; }
                .login-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 50px 40px; border-radius: 32px; width: 100%; max-width: 440px; box-shadow: 0 40px 80px rgba(0,0,0,0.1); backdrop-filter: blur(20px); }
                .login-header { text-align: center; margin-bottom: 40px; }
                .login-header .icon { font-size: 3rem; margin-bottom: 24px; background: rgba(139, 92, 246, 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
                .login-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
                .login-header p { color: var(--text-secondary); font-size: 1rem; margin: 0; }
                .login-form .form-group { margin-bottom: 24px; }
                .login-form label { display: block; margin-bottom: 8px; font-size: 0.875rem; font-weight: 600; color: var(--text-color); text-align: left; }
                .login-form input { width: 100%; padding: 16px 20px; border-radius: 16px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.2); color: var(--text-color); font-size: 1rem; transition: var(--transition); box-sizing: border-box; }
                .light-mode .login-form input { background: rgba(255,255,255,0.8); }
                .login-form input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }
                .error-message { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 12px; font-size: 0.875rem; font-weight: 500; text-align: center; margin-bottom: 24px; border: 1px solid rgba(239, 68, 68, 0.2); }
                .back-link { display: block; text-align: center; margin-top: 24px; color: var(--text-secondary); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: var(--transition); }
                .back-link:hover { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default UserLogin;
