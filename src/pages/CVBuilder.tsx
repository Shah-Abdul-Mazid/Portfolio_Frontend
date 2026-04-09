import { useEffect, useState } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Phone, Mail, Link2, MapPin, Calendar, Star, Award, Maximize2 } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();
    const [isCompact, setIsCompact] = useState(true);
    const [cvLayout, setCvLayout] = useState<'modern' | 'ats' | 'job'>('modern');
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

                <div className="layout-selector">
                    <button 
                        onClick={() => setCvLayout('modern')}
                        className={`layout-btn ${cvLayout === 'modern' ? 'active' : ''}`}
                    >
                        Modern
                    </button>
                    <button 
                        onClick={() => setCvLayout('ats')}
                        className={`layout-btn ${cvLayout === 'ats' ? 'active' : ''}`}
                    >
                        ATS
                    </button>
                    <button 
                        onClick={() => setCvLayout('job')}
                        className={`layout-btn ${cvLayout === 'job' ? 'active' : ''}`}
                    >
                        Job
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {cvLayout === 'modern' && (
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

            <div className={`cv-document ${isCompact && cvLayout === 'modern' ? 'compact-mode' : ''} ${cvLayout}-mode`}>
                {/* ===== ATS HEADER ===== */}
                {cvLayout === 'ats' && (
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

                {/* ===== JOB MODE HEADER (Formal Single Column) ===== */}
                {cvLayout === 'job' && (
                    <header className="cv-header-job">
                        <div className="cv-header-job-left">
                            <h1 className="cv-name-job">{data.hero.name}</h1>
                            {data.education && data.education.length > 0 && (
                                <div className="cv-header-job-edu">
                                    <div className="cv-job-edu-degree">{data.education[0].degree}</div>
                                    <div className="cv-job-edu-school">{data.education[0].school}</div>
                                </div>
                            )}
                        </div>
                        <div className="cv-header-job-right">
                            <div className="cv-contact-item-job">
                                <Phone size={12} />
                                <span>{data.contact.phone}</span>
                            </div>
                            <div className="cv-contact-item-job">
                                <Mail size={12} />
                                <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                            </div>
                            {data.contact.github && (
                                <div className="cv-contact-item-job">
                                    <Link2 size={12} />
                                    <a href={data.contact.github} target="_blank" rel="noopener noreferrer">GitHub Profile</a>
                                </div>
                            )}
                            {data.contact.linkedin && (
                                <div className="cv-contact-item-job">
                                    <Link2 size={12} />
                                    <a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* ===== MODERN HEADER ===== */}
                {cvLayout === 'modern' && (
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
                                    <a href={data.contact.linkedin || "#"} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
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

                {/* ===== SINGLE COLUMN BODY (ATS & JOB) ===== */}
                {(cvLayout === 'ats' || cvLayout === 'job') && (
                    <div className={`cv-body-${cvLayout}`}>
                        
                        {/* EDUCATION - Top for Job Mode */}
                        <section className={`cv-section-${cvLayout}`}>
                            <h2 className={`cv-section-heading-${cvLayout}`}>EDUCATION</h2>
                            {data.education.map((edu, idx) => (
                                <div className={`cv-item-${cvLayout}`} key={idx}>
                                    <div className={`cv-item-header-${cvLayout}`}>
                                        <div className={`cv-item-title-${cvLayout}`}>
                                            {cvLayout === 'job' && '• '}{edu.degree}
                                        </div>
                                        <div className={`cv-item-date-${cvLayout}`}>{edu.year}</div>
                                    </div>
                                    <div className={`cv-item-school-${cvLayout}`}>{edu.school}</div>
                                    <div className={`cv-item-desc-${cvLayout}`}>{edu.major}</div>
                                </div>
                            ))}
                        </section>

                        {/* EXPERIENCE */}
                        <section className={`cv-section-${cvLayout}`}>
                            <h2 className={`cv-section-heading-${cvLayout}`}>EXPERIENCE</h2>
                            {data.work.map((wk, idx) => (
                                <div className={`cv-item-${cvLayout}`} key={idx}>
                                    <div className={`cv-item-header-${cvLayout}`}>
                                        <div className={`cv-item-title-${cvLayout}`}>
                                            {cvLayout === 'job' && '• '}{wk.role}
                                        </div>
                                        <div className={`cv-item-date-${cvLayout}`}>{wk.startDate} – {wk.endDate || 'Present'}</div>
                                    </div>
                                    <div className={`cv-item-company-${cvLayout}`}>{wk.company}</div>
                                    {wk.details && wk.details.length > 0 && (
                                        <ul className="cv-item-bullets">
                                            {wk.details.map((d, i) => <li key={i}>{cvLayout === 'job' ? '- ' : ''}{d}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>

                        {/* PROJECTS */}
                        <section className={`cv-section-${cvLayout}`}>
                            <h2 className={`cv-section-heading-${cvLayout}`}>PROJECTS</h2>
                            {data.projects.map((proj, idx) => (
                                <div className={`cv-item-${cvLayout}`} key={idx}>
                                    <div className={`cv-item-header-${cvLayout}`}>
                                        <div className={`cv-item-title-${cvLayout}`}>
                                            {cvLayout === 'job' && '• '}{proj.title}
                                        </div>
                                        <div className={`cv-item-date-${cvLayout}`}>2024</div>
                                    </div>
                                    <div className={`cv-item-desc-text`}>{proj.desc}</div>
                                    <div className={`cv-item-tags-${cvLayout}`}>
                                        <strong>Technologies:</strong> {proj.tags.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Research Papers (CV Only) */}
                        {docType === 'cv' && data.papers && data.papers.length > 0 && (
                            <section className={`cv-section-${cvLayout}`}>
                                <h2 className={`cv-section-heading-${cvLayout}`}>RESEARCH PAPERS</h2>
                                {data.papers.map((paper, idx) => (
                                    <div className={`cv-item-${cvLayout}`} key={idx}>
                                        <div className={`cv-item-header-${cvLayout}`}>
                                            <div className={`cv-item-title-${cvLayout}`}>
                                                {cvLayout === 'job' && '• '}{paper.title}
                                            </div>
                                            <div className={`cv-item-date-${cvLayout}`}>{paper.year}</div>
                                        </div>
                                        <div className={`cv-item-desc-text`}>
                                            {paper.authors}. "{paper.title}." <em>{paper.venue}</em>, {paper.year}. 
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* SKILLS */}
                        <section className={`cv-section-${cvLayout}`}>
                            <h2 className={`cv-section-heading-${cvLayout}`}>TECHNICAL SKILLS</h2>
                            <div className="cv-skills-classic">
                                {data.skills.map((group, idx) => (
                                    <div className="cv-skill-group-classic" key={idx}>
                                        <strong>{group.name}:</strong> {group.items.join(', ')}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* POSITIONS OF RESPONSIBILITY (Job Mode) */}
                        {(cvLayout === 'job' || docType === 'cv') && data.activities && data.activities.length > 0 && (
                            <section className={`cv-section-${cvLayout}`}>
                                <h2 className={`cv-section-heading-${cvLayout}`}>POSITIONS OF RESPONSIBILITY</h2>
                                {data.activities.map((ach, idx) => (
                                    <div className={`cv-item-${cvLayout}`} key={idx}>
                                        <div className={`cv-item-header-${cvLayout}`}>
                                            <div className={`cv-item-title-${cvLayout}`}>
                                                {cvLayout === 'job' && '• '}{ach.role}
                                            </div>
                                            <div className={`cv-item-date-${cvLayout}`}>{ach.period}</div>
                                        </div>
                                        <div className={`cv-item-company-${cvLayout}`}>{ach.organization}</div>
                                        <div className={`cv-item-desc-text`}>{ach.desc}</div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* References (CV Only) */}
                        {docType === 'cv' && data.references && data.references.length > 0 && (
                            <section className={`cv-section-${cvLayout}`}>
                                <h2 className={`cv-section-heading-${cvLayout}`}>PROFESSIONAL REFERENCES</h2>
                                <div className="cv-references-grid-ats">
                                    {data.references.map((ref, idx) => (
                                        <div className={`cv-item-${cvLayout}`} key={idx}>
                                            <div className={`cv-item-title-${cvLayout}`}>{ref.name}</div>
                                            <div className={`cv-item-desc-text`}>
                                                {ref.title}, {ref.company}<br/>
                                                {ref.email}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* ===== MODERN BODY (Two Columns) ===== */}
                {cvLayout === 'modern' && (
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
