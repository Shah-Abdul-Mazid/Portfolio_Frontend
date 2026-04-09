import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();

    useEffect(() => {
        document.title = `${data.hero.name} | Curriculum Vitae`;
        document.body.style.backgroundColor = '#f0f0f0';
        return () => {
            document.title = 'Shah Abdul Mazid | Portfolio';
            document.body.style.backgroundColor = '';
        };
    }, [data.hero.name]);

    const handlePrint = () => window.print();

    // Reorganize skills into comma-separated strings for tabular display
    const programmingSkills = data.skills
        .find(s => s.name === 'Programming Languages')?.items.join(', ') || '';
    const otherSkills = data.skills
        .filter(s => s.name !== 'Programming Languages')
        .map(group => group.items.join(', '))
        .join(', ');

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
                {/* ===== HEADER ===== */}
                <header className="cv-header-classic">
                    <h1 className="cv-name-classic">{data.hero.name}</h1>
                    <div className="cv-contact-box">
                        <div className="cv-contact-row">
                            <span>Residence/domicile: {data.contact.location}</span>
                        </div>
                        <div className="cv-contact-row">
                            <span>E-mail: <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a></span>
                            <span className="cv-contact-sep">*</span>
                            <span>Telephone number: {data.contact.phone}</span>
                        </div>
                        <div className="cv-contact-row">
                            <span>Website: <a href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer">shahabdulmazid.vercel.app</a></span>
                        </div>
                    </div>
                </header>

                {/* ===== PROFESSIONAL SUMMARY ===== */}
                <section className="cv-section" style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '10.5pt', lineHeight: '1.45', textAlign: 'justify', margin: 0 }}>
                        {data.about.bio.split('\n')[0]} {data.hero.description}
                    </p>
                </section>

                {/* ===== EDUCATION ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Education</h2>
                    {data.education.map((edu, idx) => (
                        <div className="cv-item-classic" key={idx}>
                            <div className="cv-item-row-1">
                                <span className="cv-item-title">{edu.degree}</span>
                                <span className="cv-item-org-right">{edu.school}</span>
                            </div>
                            <div className="cv-item-row-2">
                                <span className="cv-item-subtitle">{edu.major}</span>
                                <span className="cv-item-date-right">{edu.year}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* ===== WORK EXPERIENCE ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Work experience</h2>
                    {data.work.map((wk, idx) => (
                        <div className="cv-item-classic" key={idx}>
                            <div className="cv-item-row-1">
                                <span className="cv-item-title">{wk.company}</span>
                                <span className="cv-item-date-right">{wk.startDate} – {wk.endDate || 'Present'}</span>
                            </div>
                            <div className="cv-item-row-2">
                                <span className="cv-item-subtitle">{wk.role}</span>
                                <span className="cv-item-location-right">Dhaka, Bangladesh</span>
                            </div>
                            {wk.details && wk.details.length > 0 && (
                                <ul className="cv-item-bullets">
                                    {wk.details.map((d, i) => <li key={i}>{d}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>

                {/* ===== EXTRACURRICULAR / ACHIEVEMENTS ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Certifications & Activities</h2>
                    {data.experience.map((exp, idx) => (
                        <div className="cv-item-classic" key={idx}>
                            <div className="cv-item-row-1">
                                <span className="cv-item-title">{exp.role}: {exp.company}</span>
                                <span className="cv-item-date-right">{exp.period}</span>
                            </div>
                            <p className="cv-item-desc">{exp.desc}</p>
                        </div>
                    ))}
                    {data.activities.map((act, idx) => (
                        <div className="cv-item-classic" key={idx}>
                            <div className="cv-item-row-1">
                                <span className="cv-item-title">{act.role}: {act.organization}</span>
                                <span className="cv-item-date-right">{act.period}</span>
                            </div>
                            <p className="cv-item-desc">{act.desc}</p>
                        </div>
                    ))}
                </section>

                {/* ===== TECHNICAL SKILLS ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Technical skills</h2>
                    <table className="cv-table">
                        <tbody>
                            <tr>
                                <td className="cv-label-col">Programming Languages</td>
                                <td className="cv-data-col">{programmingSkills}</td>
                            </tr>
                            <tr>
                                <td className="cv-label-col">Frameworks & Tools</td>
                                <td className="cv-data-col">{otherSkills}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* ===== LANGUAGE PROFICIENCIES ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Language proficiencies</h2>
                    <table className="cv-table">
                        <tbody>
                            <tr>
                                <td className="cv-label-col">Bengali</td>
                                <td className="cv-data-col">Native</td>
                            </tr>
                            <tr>
                                <td className="cv-label-col">English</td>
                                <td className="cv-data-col">Fluent (Professional Working Proficiency)</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* ===== PROJECTS ===== */}
                <section className="cv-section">
                    <h2 className="cv-section-heading-classic">Projects</h2>
                    <table className="cv-table">
                        <tbody>
                            {data.projects.slice(0, 4).map((proj, idx) => (
                                <tr key={idx}>
                                    <td className="cv-label-col">{proj.title}</td>
                                    <td className="cv-data-col">{proj.desc} ({proj.tags.join(', ')})</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* ===== PUBLICATIONS ===== */}
                {data.papers && data.papers.length > 0 && (
                    <section className="cv-section">
                        <h2 className="cv-section-heading-classic">Publications</h2>
                        <table className="cv-table">
                            <tbody>
                                {data.papers.slice(0, 3).map((paper, idx) => (
                                    <tr key={idx}>
                                        <td className="cv-label-col">Paper</td>
                                        <td className="cv-data-col">"{paper.title}", {paper.venue} ({paper.year})</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

            </div>
        </div>
    );
};

export default CVBuilder;
