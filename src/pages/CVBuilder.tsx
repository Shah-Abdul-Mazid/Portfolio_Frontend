import { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Phone, Mail, Link2, MapPin, Calendar, Star, Award, Layout, Maximize2 } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();
    const [isCompact, setIsCompact] = useState(true);

    useEffect(() => {
        document.title = `${data.hero.name} | Curriculum Vitae`;
        document.body.style.backgroundColor = '#f3f4f6';
        return () => {
            document.title = 'Shah Abdul Mazid | Portfolio';
            document.body.style.backgroundColor = '';
        };
    }, [data.hero.name]);

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
                    Back to Portfolio
                </Link>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setIsCompact(!isCompact)} 
                        className={`btn ${isCompact ? 'btn-active' : 'btn-back'}`}
                        title={isCompact ? "Switch to Standard View" : "Switch to One-Page Mode"}
                    >
                        {isCompact ? <Maximize2 size={16} /> : <Layout size={16} />}
                        {isCompact ? "Standard View" : "One-Page Mode"}
                    </button>
                    <button onClick={handlePrint} className="btn btn-print">
                        <Printer size={16} />
                        Save as PDF
                    </button>
                </div>
            </div>

            <div className={`cv-document ${isCompact ? 'compact-mode' : ''}`}>
                {/* ===== HEADER ===== */}
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
                    {/* Circle Badge */}
                    <div className="cv-header-badge">
                        {getInitials(data.hero.name)}
                    </div>
                </header>

                {/* ===== COLUMNS ===== */}
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
                                    <div className="cv-item-desc-text">A technology focus company specializing in AI solutions.</div>
                                    {wk.details && wk.details.length > 0 && (
                                        <ul className="cv-item-bullets">
                                            {wk.details.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>

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
                            {[...data.experience, ...data.activities].map((ach, idx) => (
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
                                    <div className="cv-meta-row">
                                        <div className="cv-meta-item">
                                            <Calendar />
                                            <span>2024</span>
                                        </div>
                                    </div>
                                    <div className="cv-item-desc-text">{proj.desc}</div>
                                    {proj.tags && (
                                        <ul className="cv-item-bullets">
                                            <li>Built using: {proj.tags.join(', ')}</li>
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                        
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CVBuilder;
