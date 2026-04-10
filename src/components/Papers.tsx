import { useState } from 'react';
import type { MouseEvent } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { ExternalLink, ChevronDown, ChevronUp, FileText, Image as ImageIcon } from 'lucide-react';
import { isImageUrl, isPdfUrl, getPdfViewerUrl } from '../utils/filePreview';

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
                                <div className="paper-header">
                                    <h3 className="paper-title">{paper.title}</h3>
                                    <div className="paper-meta">
                                        <span className="year">{paper.year}</span>
                                        {paper.venue && <span className="venue">{paper.venue}</span>}
                                    </div>
                                </div>
                                <p className="paper-authors"><strong>Authors:</strong> {paper.authors}</p>
                                
                                {paper.keywords && (
                                    <div className="paper-keywords">
                                        {paper.keywords.split(';').map((kw, i) => kw.trim() ? (
                                            <span key={i} className="keyword-tag">{kw.trim()}</span>
                                        ) : null).slice(0, 4)}
                                    </div>
                                )}
                            </div>
                            <div className="paper-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                                    {paper.doi && (
                                        <a href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} 
                                           target="_blank" rel="noreferrer" className="attachment-link">
                                            <ExternalLink size={14} style={{ marginRight: '6px' }} />
                                            Read
                                        </a>
                                    )}
                                    {paper.documentUrl && (
                                        <button onClick={() => setSelectedFile(resolveUrl(paper.documentUrl as string))} className="attachment-link">
                                            <FileText size={14} style={{ marginRight: '6px' }} />
                                            PDF
                                        </button>
                                    )}
                                </div>
                                {paper.certificateUrl && (
                                    <div className="card-previews" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <div className="mini-thumbnail" onClick={() => setSelectedFile(resolveUrl(paper.certificateUrl as string))}>
                                            {isImageUrl(paper.certificateUrl as string) ? (
                                                <img src={resolveUrl(paper.certificateUrl as string)} alt="Certificate" />
                                            ) : (
                                                <div className="mini-pdf-tag"><FileText size={16} /></div>
                                            )}
                                            <div className="thumbnail-overlay"><ExternalLink size={14} /></div>
                                        </div>
                                    </div>
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
                        {isPdfUrl(selectedFile) ? (
                            <iframe src={getPdfViewerUrl(selectedFile)} className="pdf-viewer" title="Document Viewer" />
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
                .paper-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 12px;
                }
                .paper-meta {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                    flex-shrink: 0;
                    text-align: right;
                }
                .paper-meta .year {
                    background: rgba(139,92,246,0.08);
                    color: var(--primary);
                    padding: 2px 12px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 1px solid rgba(139,92,246,0.2);
                }
                .paper-meta .venue {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    max-width: 140px;
                    line-height: 1.2;
                }
                .paper-actions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.05); }
                .attachment-link { display: inline-flex; align-items: center; background: rgba(139, 92, 246, 0.08); color: var(--primary); padding: 6px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 600; text-decoration: none; border: 1px solid rgba(139, 92, 246, 0.15); transition: all 0.3s ease; cursor: pointer; }
                .attachment-link:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); }
                
                .paper-title { 
                    font-size: 0.95rem; 
                    line-height: 1.3;
                    margin: 0; 
                    color: #fff;
                    font-weight: 700;
                    flex: 1;
                }
                .paper-authors { 
                    font-size: 0.8rem; 
                    color: var(--text-secondary); 
                    margin-bottom: 12px;
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

                .mini-thumbnail { 
                    position: relative; 
                    width: 48px; height: 60px; 
                    border-radius: 8px; 
                    overflow: hidden; 
                    border: 1px solid var(--border-color); 
                    background: rgba(0,0,0,0.3); 
                    cursor: pointer; 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3); 
                }
                .mini-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .mini-pdf-tag { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #ef4444; color: white; font-weight: 700; font-size: 0.7rem; }
                .thumbnail-overlay { position: absolute; inset: 0; background: var(--gradient); opacity: 0; display: flex; align-items: center; justify-content: center; transition: 0.3s; color: white; }
                .mini-thumbnail:hover { border-color: var(--primary); scale: 1.1; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(139,92,246,0.3); }
                .mini-thumbnail:hover .thumbnail-overlay { opacity: 0.9; }

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
