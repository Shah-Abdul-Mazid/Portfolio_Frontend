import { usePortfolio, } from '../context/PortfolioContext';
import { Award, ExternalLink, Calendar, User } from 'lucide-react';

const Certifications = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const certifications = data.certifications || [];

    if (certifications.length === 0) return null;

    return (
        <section id="certifications" className="section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.certifications?.subtitle || 'Certifications'}</span>
                    <h2>
                        {data.sections?.certifications?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.certifications.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Licenses & <span className="gradient-text">Certifications</span></>
                        )}
                    </h2>
                </div>

                <div className="cert-grid">
                    {certifications.map((cert, index) => (
                        <div key={index} className="cert-card fade-in" ref={addToRefs}>
                            <div className="cert-icon-box">
                                <Award size={24} className="cert-main-icon" />
                            </div>
                            
                            <div className="cert-content">
                                <div className="cert-header">
                                    <h3 className="cert-name">{cert.name}</h3>
                                    <span className="cert-date">
                                        <Calendar size={12} /> {cert.date}
                                    </span>
                                </div>
                                
                                <p className="cert-issuer">
                                    <strong>{cert.issuer}</strong>
                                    {cert.instructor && (
                                        <span className="cert-instructor">
                                            <User size={12} /> {cert.instructor}
                                        </span>
                                    )}
                                </p>

                                <div className="cert-footer" style={{ flexWrap: 'wrap', gap: '10px' }}>
                                    {cert.credentialId && (
                                        <span className="cert-id" style={{ marginRight: 'auto' }}>ID: {cert.credentialId}</span>
                                    )}
                                    <div className="cert-link-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {cert.credentialUrl && (
                                            <a 
                                                href={cert.credentialUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="cert-link-btn"
                                            >
                                                Verify <ExternalLink size={14} />
                                            </a>
                                        )}
                                        {cert.links?.map((link, lIdx) => (
                                            <a 
                                                key={lIdx}
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="cert-link-btn"
                                                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                                            >
                                                {link.label || 'Link'} <ExternalLink size={14} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .cert-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .cert-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    gap: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }

                .cert-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 4px; height: 100%;
                    background: var(--primary);
                    opacity: 0.5;
                }

                .cert-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--primary);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .cert-icon-box {
                    width: 56px;
                    height: 56px;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    flex-shrink: 0;
                    border: 1px solid rgba(139, 92, 246, 0.2);
                }

                .cert-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .cert-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }

                .cert-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    margin: 0;
                    line-height: 1.3;
                }

                .cert-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                    background: rgba(255,255,255,0.05);
                    padding: 2px 8px;
                    border-radius: 100px;
                }

                .cert-issuer {
                    font-size: 0.9rem;
                    color: var(--primary);
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .cert-instructor {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 2px;
                }

                .cert-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255,255,255,0.03);
                }

                .cert-id {
                    font-size: 0.7rem;
                    color: #4b5563;
                    font-family: monospace;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .cert-link-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #fff;
                    text-decoration: none;
                    background: var(--primary);
                    padding: 6px 14px;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .cert-link-btn:hover {
                    scale: 1.05;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                }

                @media (max-width: 640px) {
                    .cert-grid { grid-template-columns: 1fr; }
                    .cert-card { padding: 16px; }
                    .cert-icon-box { width: 44px; height: 44px; }
                    .cert-name { font-size: 1rem; }
                }
            `}</style>
        </section>
    );
};

export default Certifications;
