import { useEffect, useState } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Phone, Mail, Link2, MapPin, Calendar, Star, Award, Layout, Maximize2 } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();
    const [isCompact, setIsCompact] = useState(true);
    const [isATS, setIsATS] = useState(false);
    const [docType, setDocType] = useState<'resume' | 'cv'>('resume');

    useEffect(() => {
        document.title = `${data.hero.name} | ${docType.toUpperCase()}`;
        document.body.style.backgroundColor = '#f3f4f6';
        return () => {
            document.title = 'Shah Abdul Mazid | Portfolio';
            document.body.style.backgroundColor = '';
        };
    }, [data.hero.name, docType]);

    const handlePrint = () => window.print();

    // Get initials (e.g. Shah Abdul Mazid -> SA)
    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return (parts[0][0] + (parts[0][1] || '')).toUpperCase();
    };

    return (
        <div className="cv-builder-container">
            <div className="cv-controls">
                <Link to="/" className="btn btn-back">
                    <ArrowLeft size={16} />
                    Back
                </Link>
                
                {/* Document Type Selector */}
                <div className="doc-type-selector">
                    <button 
                        onClick={() => { setDocType('resume'); setIsCompact(true); }}
                        className={`type-btn ${docType === 'resume' ? 'active' : ''}`}
                    >
                        Resume
                    </button>
                    <button 
                        onClick={() => { setDocType('cv'); setIsCompact(false); }}
                        className={`type-btn ${docType === 'cv' ? 'active' : ''}`}
                    >
                        CV
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => setIsATS(!isATS)} 
                        className={`btn ${isATS ? 'btn-active' : 'btn-back'}`}
                    >
                        <Layout size={14} />
                        {isATS ? "Modern" : "ATS"}
                    </button>
                    {!isATS && (
                        <button 
                            onClick={() => setIsCompact(!isCompact)} 
                            className={`btn ${isCompact ? 'btn-active' : 'btn-back'}`}
                        >
                            <Maximize2 size={14} />
                        </button>
                    )}
                    <button onClick={handlePrint} className="btn btn-print">
                        <Printer size={14} />
                        PDF
                    </button>
                </div>
            </div>

            <div className={`cv-document ${isCompact && !isATS ? 'compact-mode' : ''} ${isATS ? 'ats-mode' : ''}`}>
                {/* ===== ATS HEADER ===== */}
                {isATS && (
                    <header className="cv-header-ats">
                        <div className="cv-header-ats-info">
                            <h1 className="cv-name">{data.hero.name}</h1>
                            <div className="cv-contact-ats">
                                <div className="cv-contact-item">
                                    <MapPin size={12} />
                                    <span>{data.contact.location}</span>
                                </div>
                                <div className="cv-contact-item">
                                    <Phone size={12} />
                                    <span>{data.contact.phone}</span>
                                </div>
                                <div className="cv-contact-item">
                                    <Mail size={12} />
                                    <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                                </div>
                                <div className="cv-contact-item">
                                    <Link2 size={12} />
                                    <a href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer">Portfolio</a>
                                </div>
                                <div className="cv-contact-item">
                                    <Link2 size={12} />
                                    <a href="https://github.com/shamazid" target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                            </div>
                        </div>
                        {data.hero.avatarUrl && (
                            <div className="cv-header-photo">
                                <img src={resolveUrl(data.hero.avatarUrl)} alt={data.hero.name} />
                            </div>
                        )}
                    </header>
                )}

                {/* ===== MODERN HEADER ===== */}
                {!isATS && (
                    <header className="cv-header-enhancv">
                        <div className="cv-header-content">
                            <h1 className="cv-name">{data.hero.name}</h1>
                            <div className="cv-title">{data.hero.roles?.join(', ') || data.hero.title}</div>
                            
                            <div className="cv-contact-grid">
                                <div className="cv-contact-item">
                                    <Phone />
                                    <span>{data.contact.phone}</span>
                                </div>
                                <div className="cv-contact-item">
                                    <Mail />
                                    <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                                </div>
                                <div className="cv-contact-item">
                                    <Link2 />
                                    <a href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer">shahabdulmazid.vercel.app</a>
                                </div>
                                <div className="cv-contact-item">
                                    <MapPin />
                                    <span>{data.contact.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="cv-header-badge">
                            {getInitials(data.hero.name)}
                        </div>
                    </header>
                )}

                {/* ===== ATS BODY (Single Column) ===== */}
                {isATS && (
                    <div className="cv-body-ats">
                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">CAREER OBJECTIVE</h2>
                            <p className="cv-text-paragraph">{data.hero.description}</p>
                        </section>

                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">PROFILE SUMMARY</h2>
                            <p className="cv-text-paragraph">{data.about.bio}</p>
                        </section>

                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">WORK EXPERIENCE</h2>
                            {data.work.map((wk, idx) => (
                                <div className="cv-item-ats" key={idx}>
                                    <div className="cv-item-header-ats">
                                        <div className="cv-item-title-ats">{wk.role}</div>
                                        <div className="cv-item-date-ats">{wk.startDate} – {wk.endDate || 'Present'}</div>
                                    </div>
                                    <div className="cv-item-company-ats">{wk.company}</div>
                                    {wk.details && wk.details.length > 0 && (
                                        <ul className="cv-item-bullets">
                                            {wk.details.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>

                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">EDUCATION</h2>
                            {data.education.map((edu, idx) => (
                                <div className="cv-item-ats" key={idx}>
                                    <div className="cv-item-header-ats">
                                        <div className="cv-item-title-ats">{edu.degree}</div>
                                        <div className="cv-item-date-ats">{edu.year}</div>
                                    </div>
                                    <div className="cv-item-company-ats">{edu.school}</div>
                                    <div className="cv-item-desc-text">{edu.major}</div>
                                </div>
                            ))}
                        </section>

                        {/* Research Papers (CV Only) */}
                        {docType === 'cv' && data.papers && data.papers.length > 0 && (
                            <section className="cv-section-ats">
                                <h2 className="cv-section-heading-ats">RESEARCH PAPERS</h2>
                                {data.papers.map((paper, idx) => (
                                    <div className="cv-item-ats" key={idx}>
                                        <div className="cv-item-header-ats">
                                            <div className="cv-item-title-ats">{paper.title}</div>
                                            <div className="cv-item-date-ats">{paper.year}</div>
                                        </div>
                                        <div className="cv-item-desc-text">
                                            {paper.authors}. "{paper.title}." <em>{paper.venue}</em>, {paper.year}. 
                                            {paper.doi && <span style={{ marginLeft: '5px' }}>DOI: {paper.doi}</span>}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">SKILLS</h2>
                            <div className="cv-skills-ats">
                                {data.skills.map((group, idx) => (
                                    <div className="cv-skill-group-ats" key={idx}>
                                        <strong>{group.name}:</strong> {group.items.join(', ')}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="cv-section-ats">
                            <h2 className="cv-section-heading-ats">PROJECTS</h2>
                            {data.projects.map((proj, idx) => (
                                <div className="cv-item-ats" key={idx}>
                                    <div className="cv-item-header-ats">
                                        <div className="cv-item-title-ats">{proj.title}</div>
                                        <div className="cv-item-date-ats">2024</div>
                                    </div>
                                    <div className="cv-item-desc-text">{proj.desc}</div>
                                    <div className="cv-item-tags-ats">Technologies: {proj.tags.join(', ')}</div>
                                </div>
                            ))}
                        </section>

                        {/* References (CV Only) */}
                        {docType === 'cv' && data.references && data.references.length > 0 && (
                            <section className="cv-section-ats">
                                <h2 className="cv-section-heading-ats">PROFESSIONAL REFERENCES</h2>
                                <div className="cv-references-grid-ats">
                                    {data.references.map((ref, idx) => (
                                        <div className="cv-item-ats" key={idx}>
                                            <div className="cv-item-title-ats">{ref.name}</div>
                                            <div className="cv-item-desc-text">
                                                {ref.title}, {ref.company}<br/>
                                                Email: {ref.email} {ref.phone && `| Phone: ${ref.phone}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* ===== MODERN BODY (Two Columns) ===== */}
                {!isATS && (
                    <div className="cv-body">
                        
                        {/* ===== LEFT COLUMN ===== */}
                        <div className="cv-col-left">
                            {/* SUMMARY */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">SUMMARY</h2>
                                <p className="cv-text-paragraph">
                                    {data.about.bio.split('\n')[0]} {data.hero.description}
                                </p>
                            </section>

                            {/* EXPERIENCE */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">EXPERIENCE</h2>
                                {data.work.map((wk, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-title">{wk.role}</div>
                                        <div className="cv-item-company">{wk.company}</div>
                                        <div className="cv-meta-row">
                                            <div className="cv-meta-item">
                                                <Calendar />
                                                <span>{wk.startDate} - {wk.endDate || 'Present'}</span>
                                            </div>
                                            <div className="cv-meta-item">
                                                <MapPin />
                                                <span>Dhaka, Bangladesh</span>
                                            </div>
                                        </div>
                                        {wk.details && wk.details.length > 0 && (
                                            <ul className="cv-item-bullets">
                                                {wk.details.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>

                            {/* Research Papers (CV Only) */}
                            {docType === 'cv' && data.papers && data.papers.length > 0 && (
                                <section className="cv-section">
                                    <h2 className="cv-section-heading">RESEARCH PAPERS</h2>
                                    {data.papers.map((paper, idx) => (
                                        <div className="cv-item" key={idx}>
                                            <div className="cv-item-title" style={{ fontSize: '9pt' }}>{paper.title}</div>
                                            <div className="cv-item-desc-text" style={{ fontSize: '7.8pt' }}>
                                                {paper.authors}. <em>{paper.venue}</em>, {paper.year}.
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* EDUCATION */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">EDUCATION</h2>
                                {data.education.map((edu, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-title">{edu.degree}</div>
                                        <div className="cv-item-company">{edu.school}</div>
                                        <div className="cv-meta-row">
                                            <div className="cv-meta-item">
                                                <Calendar />
                                                <span>{edu.year}</span>
                                            </div>
                                            <div className="cv-meta-item">
                                                <MapPin />
                                                <span>Dhaka, Bangladesh</span>
                                            </div>
                                        </div>
                                        <div className="cv-item-desc-text">{edu.major && `Major: ${edu.major}`}</div>
                                    </div>
                                ))}
                            </section>

                            {/* LANGUAGES */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">LANGUAGES</h2>
                                <div className="cv-lang-item">
                                    <div className="cv-lang-info">
                                        <span className="cv-lang-name">Bengali</span>
                                        <span className="cv-lang-prof">Native</span>
                                    </div>
                                    <div className="cv-lang-dots">
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                    </div>
                                </div>
                                <div className="cv-lang-item">
                                    <div className="cv-lang-info">
                                        <span className="cv-lang-name">English</span>
                                        <span className="cv-lang-prof">Proficient</span>
                                    </div>
                                    <div className="cv-lang-dots">
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot filled"></div>
                                        <div className="cv-dot"></div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* ===== RIGHT COLUMN ===== */}
                        <div className="cv-col-right">
                            
                            {/* KEY ACHIEVEMENTS */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">KEY ACHIEVEMENTS</h2>
                                {/* Merge experience (certifications) and activities */}
                                {[...(data.experience || []), ...(data.activities || [])].map((ach, idx) => (
                                    <div className="cv-ach-item" key={idx}>
                                        <div className="cv-ach-icon">
                                            {idx % 2 === 0 ? <Star /> : <Award />}
                                        </div>
                                        <div className="cv-ach-content">
                                            <div className="cv-item-title">{ach.role}</div>
                                            <p className="cv-text-paragraph">{ach.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* SKILLS */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">SKILLS</h2>
                                <div className="cv-skills-grid">
                                    {data.skills.map(group => 
                                        group.items.map((skill, sIdx) => (
                                            <span className="cv-skill-tag" key={`${group.name}-${sIdx}`}>
                                                {skill}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* PROJECTS */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">PROJECTS</h2>
                                {data.projects.map((proj, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-title">{proj.title}</div>
                                        <div className="cv-item-desc-text" style={{ fontSize: '7.8pt' }}>{proj.desc}</div>
                                        {proj.tags && (
                                            <ul className="cv-item-bullets">
                                                <li>{proj.tags.join(', ')}</li>
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>

                            {/* References (CV Only) */}
                            {docType === 'cv' && data.references && data.references.length > 0 && (
                                <section className="cv-section">
                                    <h2 className="cv-section-heading">REFERENCES</h2>
                                    {data.references.map((ref, idx) => (
                                        <div className="cv-item" key={idx}>
                                            <div className="cv-item-title" style={{ fontSize: '8.5pt' }}>{ref.name}</div>
                                            <div className="cv-item-desc-text" style={{ fontSize: '7.5pt' }}>
                                                {ref.title}, {ref.company}<br/>
                                                {ref.email}
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            )}
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVBuilder;
