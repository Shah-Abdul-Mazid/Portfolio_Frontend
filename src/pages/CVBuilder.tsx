import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();

    useEffect(() => {
        document.title = `${data.hero.name} | Job Curriculum Vitae`;
        document.body.style.backgroundColor = '#f8fafc';
        return () => {
            document.title = 'Shah Abdul Mazid | Portfolio';
            document.body.style.backgroundColor = '';
        };
    }, [data.hero.name]);

    const handlePrint = () => {
        window.print();
    };

    // Helper to get formatted summary
    const getSummary = () => {
        const bioFirstLine = data.about.bio.split('\n')[0];
        return `${data.hero.description} ${bioFirstLine}`;
    };

    return (
        <div className="cv-builder-container">
            <div className="cv-controls">
                <Link to="/" className="btn btn-back">
                    <ArrowLeft size={18} />
                    Back to Portfolio
                </Link>
                <button onClick={handlePrint} className="btn btn-print">
                    <Printer size={18} />
                    Download Job-Ready CV (PDF)
                </button>
            </div>

            <div className="cv-document">
                {/* Header Section */}
                <header className="cv-header">
                    <h1 className="cv-name">{data.hero.name}</h1>
                    <div className="cv-hero-roles">
                        {data.hero.roles?.join(' | ') || data.hero.title}
                    </div>
                    <div className="cv-contact-line">
                        <span>{data.contact.location}</span> | 
                        <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a> | 
                        <span>{data.contact.phone}</span> | 
                        <a href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer">shahabdulmazid.vercel.app</a>
                    </div>
                </header>

                {/* Professional Summary */}
                <section className="cv-section">
                    <h2 className="cv-section-title">Professional Summary</h2>
                    <p className="cv-item-desc" style={{ textAlign: 'justify' }}>
                        {getSummary()}
                    </p>
                </section>

                {/* Technical Skills */}
                {data.skills && data.skills.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Technical Skills</h2>
                        <ul className="cv-skills-summary">
                            {data.skills.map((skillGroup, idx) => (
                                <li key={idx}>
                                    <strong>{skillGroup.name}:</strong> {skillGroup.items.join(', ')}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Work Experience */}
                {data.work && data.work.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Professional Experience</h2>
                        {data.work.map((wk, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{wk.company}</span>
                                    <span className="cv-item-date">{wk.startDate} — {wk.endDate || 'Ongoing'}</span>
                                </div>
                                <div className="cv-item-subtitle">{wk.role}</div>
                                {wk.details && wk.details.length > 0 && (
                                    <ul className="cv-item-list">
                                        {wk.details.map((detail, dIdx) => (
                                            <li key={dIdx}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Education</h2>
                        {data.education.map((edu, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{edu.school}</span>
                                    <span className="cv-item-date">{edu.year}</span>
                                </div>
                                <div className="cv-item-subtitle">{edu.degree}</div>
                                <p className="cv-item-desc" style={{ color: '#64748b' }}>Major: {edu.major}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Key Achievements & Publications */}
                {(data.experience || data.papers) && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Achievements & Publications</h2>
                        {data.experience && data.experience.map((ach, idx) => (
                            <div className="cv-item" key={`ach-${idx}`}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{ach.role} @ {ach.company}</span>
                                    <span className="cv-item-date">{ach.period}</span>
                                </div>
                                <p className="cv-item-desc">{ach.desc}</p>
                            </div>
                        ))}
                        {data.papers && data.papers.map((paper, idx) => (
                            <div className="cv-item" key={`paper-${idx}`} style={{ marginBottom: idx === data.papers!.length - 1 ? 0 : '1rem' }}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">Research: {paper.venue}</span>
                                    <span className="cv-item-date">{paper.year}</span>
                                </div>
                                <p className="cv-item-desc" style={{ fontStyle: 'italic' }}>"{paper.title}"</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Major Projects */}
                {data.projects && data.projects.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Significant Projects</h2>
                        {data.projects.slice(0, 4).map((proj, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{proj.title}</span>
                                </div>
                                <p className="cv-item-desc" style={{ fontSize: '9pt', fontWeight: 600, color: '#64748b' }}>
                                    Stack: {proj.tags.join(', ')}
                                </p>
                                <p className="cv-item-desc">{proj.desc}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Content & Writing */}
                {data.blogs && data.blogs.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-title">Leadership & Content</h2>
                        <ul className="cv-item-list">
                            {data.blogs.slice(0, 3).map((blog, idx) => (
                                <li key={idx}>
                                    <strong>{blog.title}</strong> ({new Date(blog.date).getFullYear()})
                                </li>
                            ))}
                            {data.activities && data.activities.slice(0, 2).map((act, idx) => (
                                <li key={`act-${idx}`}>
                                    <strong>{act.role} [{act.organization}]</strong>: {act.desc}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default CVBuilder;
