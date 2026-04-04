import { useState, useEffect, useCallback } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { ExternalLink, Search } from 'lucide-react';

const Projects = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const projects = data.projects;
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    
    const [currentIndex, setCurrentIndex] = useState(projects.length - 1); // Start at showcase 6 as per screenshot

    const nextProject = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, [projects.length]);

    const prevProject = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }, [projects.length]);

    useEffect(() => {
        const timer = setInterval(nextProject, 6000);
        return () => clearInterval(timer);
    }, [nextProject]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextProject();
            if (e.key === 'ArrowLeft') prevProject();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextProject, prevProject]);

    return (
        <section id="projects" className="section alt-bg" style={{ overflow: 'hidden' }}>
            <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
                <div className="section-title fade-in" ref={addToRefs} style={{ textAlign: 'center' }}>
                    <span className="subtitle">{data.sections?.projects?.subtitle || 'Projects'}</span>
                    <h2>
                        {data.sections?.projects?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.projects.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Featured <span className="gradient-text">Projects</span></>
                        )}
                    </h2>
                </div>
                <div className="showcase-slider fade-in" ref={addToRefs}>
                    <div className="slider-container">
                        {projects.map((project, index) => {
                            let position = index - currentIndex;
                            if (position < -1) position += projects.length;
                            if (position > 1) position -= projects.length;

                            const isActive = index === currentIndex;
                            const isPrev = position === -1;
                            const isNext = position === 1;
                            const isVisible = isActive || isPrev || isNext;

                            return (
                                <div 
                                    key={index}
                                    className={`project-slide ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
                                    style={{
                                        display: isVisible ? 'block' : 'none',
                                    }}
                                >
                                    <div className={`project-card ${project.thumbnailUrl ? 'has-thumbnail' : ''}`} style={project.thumbnailUrl ? { backgroundImage: `url(${resolveUrl(project.thumbnailUrl)})` } : {}}>
                                        <div className="card-overlay"></div>
                                        <div className="card-top" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
                                            <span className="showcase-badge" style={{ marginBottom: 0 }}>SHOWCASE {project.showcase}</span>
                                            <div style={{ flex: 1, height: '1px', background: 'rgba(139, 92, 246, 0.2)' }} className="badge-line"></div>
                                            
                                            {project.certificateUrl && (
                                                <div className="mini-thumb-trigger" onClick={() => setSelectedFile(resolveUrl(project.certificateUrl))}>
                                                    <Search size={14} />
                                                    <span>Certificate</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="project-title-gradient" style={{ position: 'relative', zIndex: 2 }}>{project.title}</h3>
                                        <p className="project-desc" style={{ position: 'relative', zIndex: 2 }}>{project.desc}</p>
                                        
                                            <div className="project-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', position: 'relative', zIndex: 2 }}>
                                                <div className="project-tags">
                                                    {project.tags.map((tag, i) => (
                                                        <span key={i} className="tag-outline">{tag}</span>
                                                    ))}
                                                </div>

                                            {project.projectUrl && (
                                                <a href={resolveUrl(project.projectUrl)} target="_blank" rel="noopener noreferrer" className="project-action-btn">
                                                    <ExternalLink size={14} />
                                                    View Project
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pagination-dots">
                        {projects.map((_, index) => (
                            <button 
                                key={index} 
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {selectedFile && (
                <div className="image-modal-overlay" onClick={() => setSelectedFile(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedFile(null)}>✖</button>
                        {selectedFile.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={selectedFile} className="pdf-viewer" title="Document Viewer" />
                        ) : (
                            <img src={selectedFile} alt="Full View" className="fullscreen-image" />
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .projects-section { padding: 120px 0; overflow: hidden; position: relative; }
                .overline { color: #8b5cf6; font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px; }
                .title { font-size: 3.5rem; font-weight: 800; color: var(--text-color); margin-bottom: 60px; }
                
                .showcase-slider { width: 100%; position: relative; min-height: 500px; display: flex; flex-direction: column; align-items: center; }
                .slider-container { display: flex; align-items: center; justify-content: center; width: 100%; position: relative; height: 500px; perspective: 1500px; }
                
                .project-slide { 
                    position: absolute; 
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    width: 700px;
                    z-index: 1;
                    opacity: 0;
                    transform: scale(0.6) translateZ(-400px);
                    transform-style: preserve-3d;
                }
                
                .project-slide.active { opacity: 1; z-index: 10; transform: scale(1) translateZ(0); }
                .project-slide.prev { 
                    opacity: 0.4; 
                    z-index: 5; 
                    transform: translateX(-80%) scale(0.8) rotateY(25deg); 
                    filter: blur(2px); 
                    pointer-events: none; 
                }
                .project-slide.next { 
                    opacity: 0.4; 
                    z-index: 5; 
                    transform: translateX(80%) scale(0.8) rotateY(-25deg); 
                    filter: blur(2px); 
                    pointer-events: none; 
                }

                .project-card { 
                    background: rgba(15, 23, 42, 0.4); 
                    border: 1px solid rgba(139, 92, 246, 0.2); 
                    border-radius: 46px; 
                    padding: 60px; 
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    box-shadow: 0 30px 60px rgba(0,0,0,0.3);
                    text-align: left;
                    height: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.4s, box-shadow 0.4s;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                    background-size: cover;
                    background-position: center;
                }
                .project-card.has-thumbnail {
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .card-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%);
                    z-index: 1;
                    display: none;
                }
                .project-card.has-thumbnail .card-overlay {
                    display: block;
                }
                .project-slide.active .project-card {
                    border: 2px solid #8b5cf6;
                    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.12);
                }
                
                .dark-mode .project-card { background: rgba(15, 23, 42, 0.5); border-color: rgba(255,255,255,0.05); }
                .dark-mode .project-slide.active .project-card { border-color: #8b5cf6; }
                .dark-mode .badge-line { background: rgba(139, 92, 246, 0.3) !important; }

                    border: 1px solid rgba(139, 92, 246, 0.2);
                }

                .mini-thumb-trigger {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    cursor: pointer;
                    color: #94a3b8;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                    transition: 0.3s;
                }
                .mini-thumb-trigger:hover {
                    background: rgba(139, 92, 246, 0.15);
                    color: #8b5cf6;
                    border-color: #8b5cf6;
                }

                .project-title-gradient { 
                    font-size: 2.8rem; 
                    font-weight: 800; 
                    line-height: 1.1; 
                    margin-bottom: 32px; 
                    background: linear-gradient(90deg, #a855f7 0%, #f97316 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .project-desc { font-size: 1.125rem; color: #64748b; line-height: 1.6; margin-bottom: 48px; max-width: 90%; flex-grow: 1; }
                .dark-mode .project-desc { color: #94a3b8; }

                .project-tags { display: flex; gap: 12px; flex-wrap: wrap; flex: 1; min-width: 0; }
                .tag-outline { 
                    padding: 10px 24px; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 100px; 
                    font-size: 0.8125rem; 
                    font-weight: 700; 
                    color: #1e293b; 
                    white-space: nowrap;
                }
                .dark-mode .tag-outline { border-color: #334155; color: #f1f5f9; }

                .project-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: var(--primary);
                    color: white;
                    border-radius: 100px;
                    text-decoration: none;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: 0.3s;
                    box-shadow: 0 8px 20px rgba(139,92,246,0.3);
                    white-space: nowrap;
                }
                .project-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(139,92,246,0.4);
                    background: #7c3aed;
                }

                .pagination-dots { display: flex; gap: 8px; margin-top: 60px; align-items: center; }
                .dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e2e2; border: none; cursor: pointer; transition: 0.4s; padding: 0; }
                .dot.active { 
                    width: 32px; 
                    border-radius: 10px; 
                    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%); 
                }

                .image-modal-overlay { position: fixed; inset: 0; background: rgba(3,7,18,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); padding: 40px; }
                .image-modal-content { position: relative; max-width: 900px; width: 100%; max-height: 85vh; background: #0f172a; border-radius: 12px; padding: 10px; border: 1px solid rgba(255,255,255,0.1); }
                .close-modal-btn { position: absolute; top: -12px; right: -12px; width: 28px; height: 28px; background: #ef4444; color: white; border: none; border-radius: 50%; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .fullscreen-image { width: 100%; height: 100%; max-height: calc(85vh - 20px); object-fit: contain; }
                .pdf-viewer { width: 100%; height: calc(85vh - 20px); border: none; border-radius: 6px; background: white; }

                @media (max-width: 1024px) { 
                    .project-slide { width: 90%; }
                    .project-slide.prev, .project-slide.next { display: none !important; }
                    .project-title-gradient { font-size: 2rem; }
                    .project-card { padding: 40px 30px; border-radius: 30px; }
                    .project-desc { font-size: 1rem; margin-bottom: 30px; }
                }

                @media (max-width: 480px) {
                    .slider-container { height: 450px; perspective: none; }
                    .project-slide { width: 100%; transition: opacity 0.4s ease; transform: none !important; position: static; opacity: 1; display: none; }
                    .project-slide.active { display: block; }
                    .project-title-gradient { font-size: 1.75rem; }
                    .tag-outline { padding: 8px 16px; font-size: 0.75rem; }
                }
            `}</style>
        </section>
    );
};

export default Projects;
