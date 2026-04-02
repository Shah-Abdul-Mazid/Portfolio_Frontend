import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, MessageCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Contact = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', query: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', query: '' });
                setMessage('Message sent successfully! I will get back to you soon.');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again later.');
        }

        setTimeout(() => { if (status !== 'loading') setStatus('idle'); }, 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.contact?.subtitle || 'Contact'}</span>
                    <h2>
                        {data.sections?.contact?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.contact.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Let's Start a <span className="gradient-text">Conversation</span></>
                        )}
                    </h2>
                </div>

                <div className="contact-grid">
                    <div className="contact-info-panel fade-in" ref={addToRefs}>
                        <div className="contact-card">
                            <h3 className="card-title">Contact Information</h3>
                            <p className="card-desc">I'm currently available for freelance work, research collaborations, and full-time opportunities.</p>
                            
                            <div className="contact-details">
                                <div className="detail-item">
                                    <div className="detail-icon"><Mail size={18} /></div>
                                    <div className="detail-content">
                                        <label>Email</label>
                                        <a href={`mailto:${data.contact?.email}`}>{data.contact?.email}</a>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><Phone size={18} /></div>
                                    <div className="detail-content">
                                        <label>Phone</label>
                                        <a href={`tel:${data.contact?.phone?.replace(/\s/g, '')}`}>{data.contact?.phone}</a>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><MapPin size={18} /></div>
                                    <div className="detail-content">
                                        <label>Location</label>
                                        <span>{data.contact?.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="social-links">
                                <label className="social-label">Find me on</label>
                                <div className="social-icons">
                                    <a href={data.contact?.whatsapp} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp" title="WhatsApp">
                                        <MessageCircle size={20} />
                                    </a>
                                    <a href={data.contact?.messenger} target="_blank" rel="noopener noreferrer" className="social-btn messenger" title="Messenger">
                                        <Send size={18} style={{ transform: 'rotate(-45deg)', marginLeft: '2px' }} />
                                    </a>
                                    <a href={data.contact?.facebook} target="_blank" rel="noopener noreferrer" className="social-btn facebook" title="Facebook">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-panel fade-in" ref={addToRefs} style={{ animationDelay: '0.2s' }}>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number (Optional)</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="query">Message</label>
                                <textarea id="query" name="query" value={formData.query} onChange={handleChange} required rows={4} placeholder="Your message here..." />
                            </div>

                            <button type="submit" className={`submit-btn ${status}`} disabled={status === 'loading'}>
                                {status === 'loading' ? <><Loader2 className="spinner" size={18} /> Sending...</> :
                                 status === 'success' ? <><CheckCircle size={18} /> Sent!</> :
                                 status === 'error' ? <><AlertCircle size={18} /> Retry</> :
                                 <><Send size={18} /> Send Message</>}
                            </button>

                            {message && (
                                <div className={`form-feedback ${status}`}>
                                    {status === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: start; }
                
                .contact-card { 
                    background: rgba(255, 255, 255, 0.03); 
                    border: 1px solid var(--border-color); 
                    padding: 48px; 
                    border-radius: 32px; 
                    backdrop-filter: blur(10px);
                    height: 100%;
                }
                .card-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; color: var(--text-color); }
                .card-desc { font-size: 1rem; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6; }
                
                .contact-details { display: flex; flex-direction: column; gap: 28px; margin-bottom: 48px; }
                .detail-item { display: flex; gap: 16px; align-items: flex-start; }
                .detail-icon { 
                    width: 44px; height: 44px; background: rgba(139, 92, 246, 0.1); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; 
                    color: var(--primary); border: 1px solid rgba(139, 92, 246, 0.2); 
                    flex-shrink: 0;
                }
                .detail-content label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
                .detail-content a, .detail-content span { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); transition: color 0.2s; word-break: break-all; }
                .detail-content a:hover { color: var(--primary); }

                .social-links { border-top: 1px solid var(--border-color); padding-top: 32px; }
                .social-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 16px; }
                .social-icons { display: flex; gap: 16px; }
                .social-btn { 
                    width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; 
                    color: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255,255,255,0.05);
                }
                .social-btn:hover { transform: translateY(-3px); filter: brightness(1.2); }
                .whatsapp { background: #25D366; box-shadow: 0 8px 20px -6px rgba(37, 211, 102, 0.4); }
                .messenger { background: #0084FF; box-shadow: 0 8px 20px -6px rgba(0, 132, 255, 0.4); }
                .facebook { background: #1877F2; box-shadow: 0 8px 20px -6px rgba(24, 119, 242, 0.4); }

                .contact-form-panel { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-color); padding: 48px; border-radius: 32px; backdrop-filter: blur(10px); }
                .contact-form { display: flex; flex-direction: column; gap: 24px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); }
                .form-group input, .form-group textarea { background: rgba(0,0,0,0.2); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px 18px; color: white; transition: all 0.2s; }
                .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }
                
                .submit-btn { 
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 16px; border-radius: 14px; border: none; font-size: 1.125rem; font-weight: 700;
                    cursor: pointer; transition: all 0.3s;
                    background: var(--primary); color: white;
                }
                .submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-2px); }
                .submit-btn.success { background: #10b981; }
                .submit-btn.error { background: #ef4444; }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .form-feedback { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; font-weight: 600; margin-top: 8px; }
                .form-feedback.success { color: #10b981; }
                .form-feedback.error { color: #ef4444; }

                @media (max-width: 900px) {
                    .contact-grid { grid-template-columns: 1fr; }
                    .contact-card, .contact-form-panel { padding: 32px; border-radius: 24px; }
                }
                @media (max-width: 600px) {
                    .form-row { grid-template-columns: 1fr; }
                    .contact-card, .contact-form-panel { padding: 24px; }
                }
            `}</style>
        </section>
    );
};

export default Contact;
