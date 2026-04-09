import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();

    useEffect(() => {
        document.title = `${data.hero.name} | Curriculum Vitae`;
        document.body.style.backgroundColor = '#e8ecf1';
        return () => {
            document.title = 'Shah Abdul Mazid | Portfolio';
            document.body.style.backgroundColor = '';
        };
    }, [data.hero.name]);

    const handlePrint = () => window.print();

    return (
        <div className="cv-builder-container">
            <div className="cv-controls">
                <Link to="/" className="btn btn-back">
                    <ArrowLeft size={16} />
                    Back to Portfolio
                </Link>
                <button onClick={handlePrint} className="btn btn-print">
                    <Printer size={16} />
                    Save as PDF
                </button>
            </div>

            <div className="cv-document">
                {/* Navy left accent bar */}
                <div className="cv-accent-bar" />

                <div className="cv-content">
                    {/* ===== HEADER ===== */}
                    <header className="cv-header">
                        <h1 className="cv-name">{data.hero.name}</h1>
                        <div className="cv-subtitle">
                            {data.hero.roles?.join(' | ') || data.hero.title}
                        </div>
                        <div className="cv-contact-row">
                            <span className="cv-contact-item">
                                <span className="cv-contact-icon">📞</span>
                                {data.contact.phone}
                            </span>
                            <span className="cv-contact-item">
                                <span className="cv-contact-icon">📍</span>
                                {data.contact.location}
                            </span>
                            <a className="cv-contact-item" href={`mailto:${data.contact.email}`}>
                                <span className="cv-contact-icon">✉</span>
                                {data.contact.email}
                            </a>
                            <a className="cv-contact-item" href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer">
                                <span className="cv-contact-icon">🔗</span>
                                shahabdulmazid.vercel.app
                            </a>
                        </div>
                    </header>

                    {/* Summary bar — from data.about.bio */}
                    <p className="cv-summary-bar">
                        {data.about.bio.split('\n')[0]} {data.hero.description}
                    </p>

                    {/* ===== TWO-COLUMN BODY ===== */}
                    <div className="cv-body">
                        {/* ===== LEFT COLUMN ===== */}
                        <div className="cv-col-left">
                            {/* Education — from data.education */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">🎓</span>
                                    Education
                                </h2>
                                {data.education.map((edu, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-role">{edu.degree}</div>
                                        <div className="cv-item-company">{edu.school}</div>
                                        <p className="cv-item-text">{edu.year} — {edu.major}</p>
                                    </div>
                                ))}
                            </section>

                            {/* Publications — from data.papers */}
                            {data.papers && data.papers.length > 0 && (
                                <section className="cv-section">
                                    <h2 className="cv-section-heading">
                                        <span className="cv-heading-icon">📄</span>
                                        Publications
                                    </h2>
                                    {data.papers.slice(0, 4).map((paper, idx) => (
                                        <div className="cv-item" key={idx}>
                                            <div className="cv-item-role">"{paper.title}"</div>
                                            <div className="cv-item-company">{paper.venue}, {paper.year}</div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Languages */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">🌐</span>
                                    Languages
                                </h2>
                                <div className="cv-lang-row">
                                    <div className="cv-lang-item">
                                        <span className="cv-lang-dot" />
                                        <span>Bengali (Native)</span>
                                    </div>
                                    <div className="cv-lang-item">
                                        <span className="cv-lang-dot" />
                                        <span>English (Fluent)</span>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* ===== RIGHT COLUMN ===== */}
                        <div className="cv-col-right">
                            {/* Work Experience — from data.work */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">💼</span>
                                    Work Experience
                                </h2>
                                {data.work.map((wk, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-row">
                                            <span className="cv-item-role">{wk.role}</span>
                                            <span className="cv-item-date">{wk.startDate} – {wk.endDate || 'Present'}</span>
                                        </div>
                                        <div className="cv-item-company">{wk.company}, Dhaka</div>
                                        {wk.details && wk.details.length > 0 && (
                                            <ul className="cv-item-list">
                                                {wk.details.map((d, i) => <li key={i}>{d}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>

                            {/* Certifications — from data.experience */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">🏆</span>
                                    Certifications
                                </h2>
                                {data.experience.map((exp, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-role">{exp.role}</div>
                                        <p className="cv-item-text">{exp.company} ({exp.period}). {exp.desc}</p>
                                    </div>
                                ))}
                            </section>

                            {/* Skills — from data.skills */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">⚙</span>
                                    Skills
                                </h2>
                                <div className="cv-skills-tags">
                                    {data.skills.map((group) =>
                                        group.items.map((skill, sIdx) => (
                                            <span className="cv-skill-tag" key={sIdx}>{skill}</span>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Projects — from data.projects */}
                            <section className="cv-section">
                                <h2 className="cv-section-heading">
                                    <span className="cv-heading-icon">📁</span>
                                    Projects
                                </h2>
                                {data.projects.slice(0, 4).map((proj, idx) => (
                                    <div className="cv-item" key={idx}>
                                        <div className="cv-item-role">{proj.title}</div>
                                        <div className="cv-item-company">Stack: {proj.tags.join(', ')}</div>
                                        <p className="cv-item-text">{proj.desc}</p>
                                    </div>
                                ))}
                            </section>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVBuilder;
