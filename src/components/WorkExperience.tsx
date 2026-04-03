import { useState } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { calculateWorkDuration, formatDateLabel, sortRecentFirst } from '../utils/dateUtils';
import { FileText, Award, ExternalLink, X } from 'lucide-react';

interface DocInfo {
    url: string;
    label: string;
    type: 'appointment' | 'experience' | 'generic';
}

const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);
const isPdf = (url: string) => /\.pdf$/i.test(url);

/* ---------- Mini thumbnail for one document ---------- */
const DocThumbnail = ({ doc, onClick }: { doc: DocInfo; onClick: () => void }) => {
    const resolved = resolveUrl(doc.url);
    const pdf = isPdf(doc.url);
    const img = isImage(doc.url);

    const accentColor = doc.type === 'appointment' ? '#8b5cf6' : '#3b82f6';
    const IconComp = doc.type === 'appointment' ? FileText : Award;

    return (
        <div className="doc-thumb-wrap" onClick={onClick} title={`View ${doc.label}`}>
            <div className="doc-thumb-card" style={{ '--accent': accentColor } as React.CSSProperties}>
                {/* Preview area */}
                <div className="doc-thumb-preview">
                    {img && (
                        <img src={resolved} alt={doc.label} className="doc-thumb-img" />
                    )}
                    {pdf && (
                        <iframe
                            src={`${resolved}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            className="doc-thumb-iframe"
                            title={doc.label}
                            scrolling="no"
                        />
                    )}
                    {!img && !pdf && (
                        <div className="doc-thumb-icon-bg">
                            <IconComp size={28} color={accentColor} />
                        </div>
                    )}
                    {/* Hover overlay */}
                    <div className="doc-thumb-hover">
                        <ExternalLink size={18} color="white" />
                        <span>View</span>
                    </div>
                </div>
                {/* Label */}
                <div className="doc-thumb-label">
                    <IconComp size={11} color={accentColor} />
                    <span>{doc.label}</span>
                </div>
            </div>
        </div>
    );
};

/* ---------- Modal ---------- */
const DocModal = ({ doc, onClose }: { doc: DocInfo; onClose: () => void }) => {
    const resolved = resolveUrl(doc.url);
    const pdf = isPdf(doc.url);

    return (
        <div className="doc-modal-overlay" onClick={onClose}>
            <div className="doc-modal-box" onClick={e => e.stopPropagation()}>
                {/* Header bar */}
                <div className="doc-modal-header">
                    <span className="doc-modal-title">{doc.label}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <a
                            href={resolved}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doc-modal-open-btn"
                            title="Open in new tab"
                        >
                            <ExternalLink size={14} />
                            Open in Tab
                        </a>
                        <button className="doc-modal-close-btn" onClick={onClose} aria-label="Close">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="doc-modal-body">
                    {pdf ? (
                        <object
                            data={resolved}
                            type="application/pdf"
                            className="doc-modal-object"
                        >
                            {/* Fallback for browsers that block object */}
                            <div className="doc-modal-fallback">
                                <FileText size={48} color="#8b5cf6" />
                                <p>Your browser cannot display this PDF inline.</p>
                                <a href={resolved} target="_blank" rel="noopener noreferrer" className="doc-modal-open-btn">
                                    <ExternalLink size={14} /> Open PDF
                                </a>
                            </div>
                        </object>
                    ) : (
                        <img src={resolved} alt={doc.label} className="doc-modal-img" />
                    )}
                </div>
            </div>
        </div>
    );
};

/* ---------- Main Component ---------- */
const WorkExperience = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const workHistory = sortRecentFirst(data.work || []);
    const [activeDoc, setActiveDoc] = useState<DocInfo | null>(null);

    return (
        <section id="work" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.work?.subtitle || 'Career Journey'}</span>
                    <h2>
                        {data.sections?.work?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.work.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Professional <span className="gradient-text">Experience</span></>
                        )}
                    </h2>
                </div>

                <div className="card-stack">
                    {workHistory.map((job, index) => {
                        const docs: DocInfo[] = [];
                        if (job.appointmentLetterUrl)
                            docs.push({ url: job.appointmentLetterUrl, label: 'Appointment Letter', type: 'appointment' });
                        if (job.experienceLetterUrl)
                            docs.push({ url: job.experienceLetterUrl, label: 'Experience Letter', type: 'experience' });

                        return (
                            <div key={index} className="unified-card fade-in" ref={addToRefs}>
                                <div className="card-header">
                                    <div className="card-title-group">
                                        <h3 className="card-title">{job.role}</h3>
                                        <p className="card-subtitle">{job.company}</p>
                                    </div>
                                    <div className="card-meta">
                                        <span className="card-period">{formatDateLabel(job.startDate)} – {formatDateLabel(job.endDate)}</span>
                                        <span className="card-duration">{calculateWorkDuration(job.startDate, job.endDate)}</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="card-content">
                                        <ul className="card-list">
                                            {job.details.map((detail, i) => (
                                                <li key={i}>{detail}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {docs.length > 0 && (
                                        <div className="card-docs">
                                            {docs.map(doc => (
                                                <DocThumbnail
                                                    key={doc.url}
                                                    doc={doc}
                                                    onClick={() => setActiveDoc(doc)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Document Modal */}
            {activeDoc && <DocModal doc={activeDoc} onClose={() => setActiveDoc(null)} />}

            <style>{`
                /* ===== Layout ===== */
                .card-stack { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .unified-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 16px; transition: var(--transition); }
                .unified-card:hover { border-color: var(--primary); transform: translateY(-2px); }

                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; gap: 20px; }
                .card-title { font-size: 1.2rem; color: #fff; margin: 0 0 4px 0; font-weight: 700; }
                .card-subtitle { color: var(--primary); font-weight: 700; font-size: 0.95rem; margin: 0; }

                .card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                .card-period { background: rgba(139,92,246,0.08); color: var(--primary); padding: 2px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); white-space: nowrap; }
                .card-duration { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

                .card-body { display: flex; gap: 24px; align-items: flex-start; }
                .card-content { flex: 1; min-width: 0; }
                .card-list { list-style: none; padding: 0; margin: 0; }
                .card-list li { position: relative; padding-left: 18px; margin-bottom: 8px; color: var(--text-secondary); line-height: 1.6; font-size: 0.88rem; }
                .card-list li::before { content: '•'; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

                /* ===== Doc Thumbnails ===== */
                .card-docs { display: flex; gap: 12px; flex-shrink: 0; align-items: flex-start; padding-top: 2px; }

                .doc-thumb-wrap { cursor: pointer; }
                .doc-thumb-card {
                    width: 90px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(0,0,0,0.4);
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
                }
                .doc-thumb-card:hover {
                    border-color: var(--accent, #8b5cf6);
                    transform: translateY(-4px) scale(1.04);
                    box-shadow: 0 12px 30px rgba(139,92,246,0.25);
                }

                .doc-thumb-preview {
                    position: relative;
                    width: 90px;
                    height: 120px;
                    overflow: hidden;
                    background: #0f172a;
                }
                .doc-thumb-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .doc-thumb-iframe {
                    width: 600%;
                    height: 600%;
                    border: none;
                    transform: scale(0.1667);
                    transform-origin: top left;
                    pointer-events: none;
                    background: white;
                }
                .doc-thumb-icon-bg {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(139,92,246,0.06);
                }
                .doc-thumb-hover {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.65);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    backdrop-filter: blur(2px);
                }
                .doc-thumb-hover span { color: white; font-size: 0.7rem; font-weight: 600; }
                .doc-thumb-card:hover .doc-thumb-hover { opacity: 1; }

                .doc-thumb-label {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 5px 7px;
                    background: rgba(255,255,255,0.03);
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .doc-thumb-label span {
                    font-size: 0.6rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ===== Modal ===== */
                .doc-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(3,7,18,0.92);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    backdrop-filter: blur(10px);
                }
                .doc-modal-box {
                    position: relative;
                    width: 100%;
                    max-width: 860px;
                    max-height: 90vh;
                    background: #0f172a;
                    border-radius: 16px;
                    border: 1px solid rgba(139,92,246,0.25);
                    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .doc-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    background: rgba(255,255,255,0.02);
                    flex-shrink: 0;
                    gap: 12px;
                }
                .doc-modal-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-color);
                    opacity: 0.85;
                }
                .doc-modal-open-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.35);
                    border-radius: 8px;
                    color: var(--primary);
                    font-size: 0.78rem;
                    font-weight: 600;
                    padding: 5px 12px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: var(--transition);
                }
                .doc-modal-open-btn:hover { background: rgba(139,92,246,0.3); }
                .doc-modal-close-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: rgba(239,68,68,0.15);
                    border: 1px solid rgba(239,68,68,0.3);
                    border-radius: 8px;
                    cursor: pointer;
                    color: #f87171;
                    transition: var(--transition);
                    flex-shrink: 0;
                }
                .doc-modal-close-btn:hover { background: rgba(239,68,68,0.3); }
                .doc-modal-body {
                    flex: 1;
                    overflow: auto;
                    min-height: 0;
                    display: flex;
                    align-items: stretch;
                }
                .doc-modal-object {
                    width: 100%;
                    height: calc(90vh - 62px);
                    border: none;
                    background: white;
                    display: block;
                }
                .doc-modal-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    max-height: calc(90vh - 62px);
                    display: block;
                }
                .doc-modal-fallback {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    padding: 40px;
                    color: var(--text-muted);
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .unified-card { padding: 16px; }
                    .card-header { flex-direction: column; gap: 10px; }
                    .card-meta { align-items: flex-start; }
                    .card-body { flex-direction: column; gap: 16px; }
                    .card-docs { flex-direction: row; }
                    .doc-thumb-card { width: 70px; }
                    .doc-thumb-preview { width: 70px; height: 93px; }
                    .doc-thumb-iframe { width: 600%; height: 600%; }
                }
            `}</style>
        </section>
    );
};

export default WorkExperience;
