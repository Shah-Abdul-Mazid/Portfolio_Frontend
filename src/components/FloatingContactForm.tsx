import { useState } from 'react';
import { MessageSquare, X, Send, Phone, Mail, User } from 'lucide-react';
// import { supabase } from '../utils/supabaseClient'; // No longer using Supabase for messages

const FloatingContactForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        query: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', query: '' });
            setTimeout(() => {
                setStatus('idle');
                setIsOpen(false);
            }, 3000);
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="floating-container">
            {/* Toggle Button */}
            <button 
                className={`fab ${isOpen ? 'active' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Contact support"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Form Drawer */}
            <div className={`form-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>Send a Message</h3>
                    <p>I'll get back to you as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit} className="drawer-form">
                    <div className="input-group">
                        <label><User size={14} /> Name</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label><Mail size={14} /> Email</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label><Phone size={14} /> Phone (Optional)</label>
                        <input 
                            type="tel" 
                            placeholder="+880 1XXX-XXXXXX"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label>Your Query</label>
                        <textarea 
                            required 
                            rows={4} 
                            placeholder="How can I help you?"
                            value={formData.query}
                            onChange={e => setFormData({...formData, query: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`submit-btn ${status}`} 
                        disabled={status === 'submitting' || status === 'success'}
                    >
                        {status === 'submitting' ? 'Sending...' : 
                         status === 'success' ? 'Sent successfully!' : 
                         status === 'error' ? 'Failed to send' : 
                         <><Send size={18} /> Send Message</>}
                    </button>
                </form>
            </div>

            <style>{`
                .floating-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
                
                .fab { 
                    width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white;
                    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .fab:hover { transform: scale(1.1); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.6); }
                .fab.active { background: #1e293b; transform: rotate(90deg); }

                .form-drawer {
                    position: absolute; bottom: 80px; right: 0; width: 350px; background: #0b1120;
                    border: 1px solid #1e293b; border-radius: 20px; padding: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4); opacity: 0; visibility: hidden;
                    transform: translateY(20px) scale(0.95); transition: all 0.3s ease;
                }
                .form-drawer.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

                .drawer-header h3 { color: #f8fafc; margin-bottom: 4px; font-size: 1.25rem; }
                .drawer-header p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 24px; }

                .drawer-form { display: flex; flex-direction: column; gap: 16px; }
                .input-group label { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; font-weight: 700; }
                .input-group input, .input-group textarea {
                    width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px;
                    padding: 12px 14px; color: #f8fafc; font-family: inherit; font-size: 0.9rem; transition: border 0.2s;
                }
                .input-group input:focus, .input-group textarea:focus { outline: none; border-color: #3b82f6; }

                .submit-btn {
                    margin-top: 8px; padding: 14px; border-radius: 10px; border: none; background: #3b82f6;
                    color: white; font-weight: 700; cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 10px; transition: all 0.2s;
                }
                .submit-btn:hover { background: #2563eb; }
                .submit-btn.success { background: #10b981; }
                .submit-btn.error { background: #ef4444; }
                .submit-btn:disabled { cursor: not-allowed; opacity: 0.8; }

                @media (max-width: 480px) {
                    .form-drawer { width: calc(100vw - 40px); right: -10px; bottom: 80px; }
                }
            `}</style>
        </div>
    );
};

export default FloatingContactForm;
