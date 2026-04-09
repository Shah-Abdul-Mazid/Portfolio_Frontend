import { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import './CVBuilder.css';

const CVBuilder = () => {
    const { data } = usePortfolio();

    // Disable any general site styling on body when on this page
    useEffect(() => {
        document.body.style.backgroundColor = '#f3f4f6';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handlePrint = () => {
        window.print();
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
                    Download PDF / Print
                </button>
            </div>

            <div className="cv-document">
                {/* Header Section */}
                <div className="cv-header">
                    <h1 className="cv-name">{data.hero.name}</h1>
                    <div className="cv-contact">
                        {data.contact.email && (
                            <span className="cv-contact-item">
                                <Mail size={12} /> {data.contact.email}
                            </span>
                        )}
                        {data.contact.phone && (
                            <span className="cv-contact-item">
                                <Phone size={12} /> {data.contact.phone}
                            </span>
                        )}
                        {data.contact.location && (
                            <span className="cv-contact-item">
                                <MapPin size={12} /> {data.contact.location}
                            </span>
                        )}
                        <span className="cv-contact-item">
                            <Globe size={12} /> {window.location.hostname}
                        </span>
                    </div>
                </div>

                {/* Summary / About Section */}
                <div className="cv-section">
                    <h2 className="cv-section-title">Professional Summary</h2>
                    <p className="cv-item-desc">
                        {data.hero.description} {data.about.bio.split('\n')[0]}
                    </p>
                </div>

                {/* Education Section */}
                {data.education && data.education.length > 0 && (
                    <div className="cv-section">
                        <h2 className="cv-section-title">Education</h2>
                        {data.education.map((edu, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{edu.degree}</span>
                                    <span className="cv-item-date">{edu.year}</span>
                                </div>
                                <div className="cv-item-subtitle">{edu.school}</div>
                                {edu.major && <div className="cv-item-desc">{edu.major}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills Section */}
                {data.skills && data.skills.length > 0 && (
                    <div className="cv-section">
                        <h2 className="cv-section-title">Technical Skills</h2>
                        <div className="cv-skills-grid">
                            {data.skills.map((skillGroup, idx) => (
                                <div className="cv-skill-category" key={idx}>
                                    <strong>{skillGroup.name}:</strong> {skillGroup.items.join(', ')}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Work Experience Section */}
                {data.work && data.work.length > 0 && (
                    <div className="cv-section">
                        <h2 className="cv-section-title">Experience</h2>
                        {data.work.map((wk, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">{wk.role} - {wk.company}</span>
                                    <span className="cv-item-date">
                                        {wk.startDate} - {wk.endDate || 'Present'}
                                    </span>
                                </div>
                                {wk.details && wk.details.length > 0 && (
                                    <ul className="cv-item-list">
                                        {wk.details.map((detail, dIdx) => (
                                            <li key={dIdx}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects Section */}
                {data.projects && data.projects.length > 0 && (
                    <div className="cv-section">
                        <h2 className="cv-section-title">Projects</h2>
                        {data.projects.map((proj, idx) => (
                            <div className="cv-item" key={idx}>
                                <div className="cv-item-header">
                                    <span className="cv-item-title">
                                        {proj.title}
                                    </span>
                                </div>
                                <div className="cv-item-subtitle" style={{ fontSize: '9pt', color: '#444' }}>
                                    Technologies: {proj.tags.join(', ')}
                                </div>
                                <p className="cv-item-desc">{proj.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVBuilder;
