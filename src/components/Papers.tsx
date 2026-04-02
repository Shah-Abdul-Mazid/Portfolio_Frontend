import { useState } from 'react';
import type { MouseEvent } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, ChevronDown, ChevronUp, FileText, Image as ImageIcon } from 'lucide-react';

const Papers = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const papers = data.papers || [];
    const [showAll, setShowAll] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const closeModal = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedFile(null);
        }
    };

    if (papers.length === 0) return null;

    const displayedPapers = showAll ? papers : papers.slice(0, 8);

    return (
        <section id="papers" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.papers?.subtitle || 'Publications'}</span>
                    <h2>
                        {data.sections?.papers?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.papers.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Research <span className="gradient-text">Papers</span></>
                        )}
                    </h2>
                </div>
                <div className="papers-grid">
                    {displayedPapers.map((paper, index) => (
                        <div key={index} className="paper-card fade-in" ref={addToRefs}>
                            <div className="paper-content">
                                <div className="paper-meta">
                                    <span className="year">{paper.year}</span>
                                    {paper.venue && <span className="venue">{paper.venue}</span>}
                                </div>
                                <h3 className="paper-title">{paper.title}</h3>
                                <p className="paper-authors">{paper.authors}</p>
                                
                                {paper.keywords && (
                                    <div className="paper-keywords">
                                        {paper.keywords.split(';').map((kw, i) => kw.trim() ? (
                                            <span key={i} className="keyword-tag">{kw.trim()}</span>
                                        ) : null).slice(0, 4)}
                                    </div>
                                )}
                            </div>
                            <div className="paper-actions">
                                {paper.doi && (
                                    <a href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} 
                                       target="_blank" rel="noreferrer" className="attachment-link">
                                        <ExternalLink size={14} style={{ marginRight: '6px' }} />
                                        Read Paper
                                    </a>
                                )}
                                {paper.documentUrl && (
                                    <button onClick={() => setSelectedFile(paper.documentUrl as string)} className="attachment-link">
                                        <FileText size={14} style={{ marginRight: '6px' }} />
                                        Preview PDF
                                    </button>
                                )}
                                {paper.certificateUrl && (
                                    <button onClick={() => setSelectedFile(paper.certificateUrl as string)} className="attachment-link">
                                        <ImageIcon size={14} style={{ marginRight: '6px' }} />
                                        Certificate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {papers.length > 8 && (
                    <div className="fade-in" style={{ textAlign: 'center', marginTop: '40px' }} ref={addToRefs}>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setShowAll(!showAll)} 
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '100px', cursor: 'pointer', transition: 'var(--transition)' }}
                        >
                            {showAll ? 'Show Less Papers' : `View All ${papers.length} Papers`}
                            {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                )}
            </div>

            {selectedFile && (
                <div className="image-modal-overlay" onClick={closeModal}>
                    <div className="image-modal-content">
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✖</button>
                        {selectedFile.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedFile} className="pdf-viewer" title="Document Viewer" />
                        ) : (
                            <img src={selectedFile} alt="Fullscreen View" className="fullscreen-image" />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .papers-grid { 
                    display: grid; 
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 16px; 
                }
                .paper-card { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    border-radius: 12px; 
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden; 
                    transition: var(--transition); 
                    position: relative;
                }
                .paper-card:hover { 
                    transform: translateY(-6px); 
                    border-color: var(--primary); 
                    box-shadow: 0 10px 30px rgba(59,130,246,0.1);
                }
                .paper-content { 
                    padding: 16px; 
                }
                .paper-meta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 0.70rem;
                    color: var(--text-secondary);
                    flex-wrap: wrap;
                }
                .paper-actions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.05); }
                .attachment-link { display: inline-flex; align-items: center; background: rgba(139, 92, 246, 0.08); color: var(--primary); padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(139, 92, 246, 0.15); transition: all 0.3s ease; cursor: pointer; }
                .attachment-link:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
                
                .paper-meta .venue {
                    font-style: italic;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 140px;
                }
                .paper-title { 
                    font-size: 0.95rem; 
                    line-height: 1.3;
                    margin-bottom: 8px; 
                    color: var(--text-main);
                }
                .paper-authors { 
                    font-size: 0.8rem; 
                    color: var(--text-secondary); 
                    margin-bottom: 12px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .paper-keywords {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 12px;
                }
                .keyword-tag {
                    font-size: 0.65rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 100px;
                    color: var(--text-muted);
                }

                .image-modal-overlay { position: fixed; inset: 0; background: rgba(3,7,18,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 40px; animation: modalFadeIn 0.3s ease-out; }
                .image-modal-content { position: relative; max-width: 1200px; width: 100%; max-height: 90vh; background: #0f172a; border-radius: 16px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                .close-modal-btn { position: absolute; top: -16px; right: -16px; width: 32px; height: 32px; background: #ef4444; color: white; border: none; border-radius: 50%; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .fullscreen-image { width: 100%; height: 100%; max-height: calc(90vh - 24px); object-fit: contain; }
                .pdf-viewer { width: 100%; height: calc(90vh - 24px); border: none; border-radius: 8px; background: white; }
                @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
                
                @media (max-width: 1200px) {
                    .papers-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .papers-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .papers-grid { grid-template-columns: 1fr; }
                    .image-modal-overlay { padding: 16px; }
                }
            `}</style>
        </section>
    );
};

export default Papers;
