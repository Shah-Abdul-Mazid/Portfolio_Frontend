import { useRef } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Linkedin, Github, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Resume = () => {
    const { data } = usePortfolio();
    const resumeRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!resumeRef.current) return;
        
        try {
            const canvas = await html2canvas(resumeRef.current, {
                scale: 3, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.hero.name.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Present';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="resume-viewer-container">
            <div className="resume-actions-bar">
                <button onClick={downloadPDF} className="btn-modern-download">
                    <Download size={20} />
                    <span>Download PDF Resume</span>
                </button>
            </div>

            <div className="resume-canvas" ref={resumeRef}>
                {/* PDF Header Section */}
                <header className="resume-top-header">
                    <div className="header-info">
                        <h1 className="name-title">{data.hero.name}</h1>
                        <p className="headline-title">{data.hero.title}</p>
                        <p className="university-title">{data.education[0]?.school || 'American International University-Bangladesh (AIUB)'}</p>
                        
                        <div className="contact-grid">
                            <div className="contact-item">
                                <MapPin size={12} className="c-icon" />
                                <span>{data.contact.location}</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={12} className="c-icon" />
                                <span>{data.contact.email}</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={12} className="c-icon" />
                                <span>{data.contact.phone}</span>
                            </div>
                            <div className="contact-item">
                                <Linkedin size={12} className="c-icon" />
                                <span>{data.contact.linkedin?.split('/').pop() || data.hero.name}</span>
                            </div>
                            <div className="contact-item">
                                <Github size={12} className="c-icon" />
                                <span>{data.contact.github?.split('/').pop() || data.hero.name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-photo">
                        <div className="photo-frame">
                            <img 
                                src={data.hero.avatarUrl ? resolveUrl(data.hero.avatarUrl) : '/assets/avtar.png'} 
                                alt={data.hero.name} 
                                crossOrigin="anonymous"
                            />
                        </div>
                    </div>
                </header>

                <div className="resume-content-layout">
                    {/* LEFT COLUMN */}
                    <aside className="resume-left-col">
                        {/* EXPERIENCE */}
                        <section className="resume-block">
                            <h2 className="block-title">Professional Experience</h2>
                            <div className="title-underline"></div>
                            {data.work.map((w, i) => (
                                <div key={i} className="content-item">
                                    <h3 className="item-main-title">{w.role}</h3>
                                    <p className="item-sub-title">{w.company}</p>
                                    <div className="item-metadata">
                                        <span>📅 {formatDate(w.startDate)} – {w.endDate ? formatDate(w.endDate) : 'Present'}</span>
                                        <span>📍 Dhaka, Bangladesh</span>
                                    </div>
                                    <ul className="item-bullet-list">
                                        {w.details.slice(0, 3).map((detail, di) => (
                                            <li key={di}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* EDUCATION */}
                        <section className="resume-block">
                            <h2 className="block-title">Education</h2>
                            <div className="title-underline"></div>
                            {data.education.map((e, i) => (
                                <div key={i} className="content-item">
                                    <h3 className="item-main-title">{e.degree}</h3>
                                    <p className="item-sub-title">{e.school} {e.major ? `- ${e.major}` : ''}</p>
                                    <div className="item-metadata">
                                        <span>📅 {e.year}</span>
                                        <span>📍 Dhaka, Bangladesh</span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* ACHIEVEMENTS */}
                        <section className="resume-block">
                            <h2 className="block-title">Achievements</h2>
                            <div className="title-underline"></div>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="content-item">
                                    <h3 className="item-main-title">{exp.role}</h3>
                                    <p className="item-desc-text">{exp.desc}</p>
                                </div>
                            ))}
                        </section>

                        {/* ACTIVITIES */}
                        <section className="resume-block">
                            <h2 className="block-title">Extra-Curricular Activities</h2>
                            <div className="title-underline"></div>
                            <ul className="item-bullet-list spacing-large">
                                {data.activities.map((act, i) => (
                                    <li key={i}>
                                        <strong>{act.role}</strong> at {act.organization}. {act.desc && `(${act.desc})`}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </aside>

                    {/* RIGHT COLUMN */}
                    <main className="resume-right-col">
                        {/* SKILLS */}
                        <section className="resume-block">
                            <h2 className="block-title">Technical Skills</h2>
                            <div className="title-underline"></div>
                            {data.skills.map((cat, i) => (
                                <div key={i} className="skill-category-box">
                                    <h4 className="skill-cat-label">{cat.name}</h4>
                                    <ul className="skill-dot-list">
                                        {cat.items.map((skill, si) => (
                                            <li key={si}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* RESEARCH */}
                        <section className="resume-block">
                            <h2 className="block-title">Research Papers</h2>
                            <div className="title-underline"></div>
                            <ul className="item-bullet-list">
                                {data.papers.map((paper, i) => (
                                    <li key={i}>{paper.title}</li>
                                ))}
                            </ul>
                        </section>

                        {/* PROJECTS */}
                        <section className="resume-block">
                            <h2 className="block-title">Projects</h2>
                            <div className="title-underline"></div>
                            <ul className="item-bullet-list">
                                {data.projects.map((proj, i) => (
                                    <li key={i}>{proj.title}</li>
                                ))}
                            </ul>
                        </section>
                    </main>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .resume-viewer-container {
                    padding: 60px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }

                .resume-actions-bar {
                    margin-bottom: 30px;
                    width: 100%;
                    max-width: 850px;
                    display: flex;
                    justify-content: flex-end;
                }

                .btn-modern-download {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
                }

                .btn-modern-download:hover {
                    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.35);
                    transform: translateY(-2px);
                }

                .resume-canvas {
                    width: 210mm;
                    background: white;
                    padding: 18mm;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
                    color: #1e293b;
                    box-sizing: border-box;
                    line-height: 1.4;
                }

                .resume-top-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                }

                .header-info {
                    flex: 1;
                }

                .name-title {
                    font-size: 34px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 6px 0;
                    letter-spacing: -0.02em;
                }

                .headline-title {
                    font-size: 16px;
                    color: #1a73e8;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    text-transform: capitalize;
                }

                .university-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #1a73e8;
                    margin: 0 0 16px 0;
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    color: #555;
                    font-weight: 500;
                }

                .c-icon {
                    color: #1a73e8;
                    flex-shrink: 0;
                }

                .header-photo {
                    margin-left: 20px;
                }

                .photo-frame {
                    width: 110px;
                    height: 130px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }

                .photo-frame img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .resume-content-layout {
                    display: grid;
                    grid-template-columns: 1.5fr 1.1fr;
                    gap: 35px;
                }

                .resume-block {
                    margin-bottom: 24px;
                }

                .block-title {
                    font-size: 20px;
                    color: #2c3e50;
                    font-weight: 800;
                    margin: 0 0 6px 0;
                    text-transform: capitalize;
                }

                .title-underline {
                    height: 3px;
                    background: #1a73e8;
                    width: 100%;
                    margin-bottom: 15px;
                }

                .content-item {
                    margin-bottom: 16px;
                }

                .item-main-title {
                    font-size: 14.5px;
                    font-weight: 700;
                    color: #444;
                    margin: 0 0 3px 0;
                }

                .item-sub-title {
                    font-size: 13px;
                    color: #1a73e8;
                    font-weight: 700;
                    margin: 0 0 6px 0;
                }

                .item-metadata {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #777;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .item-bullet-list {
                    margin: 0;
                    padding-left: 18px;
                    font-size: 11.5px;
                    color: #555;
                    line-height: 1.6;
                }

                .item-bullet-list li {
                    margin-bottom: 4px;
                }

                .item-bullet-list.spacing-large li {
                    margin-bottom: 10px;
                }

                .item-desc-text {
                    font-size: 11.5px;
                    color: #666;
                    line-height: 1.5;
                    margin: 5px 0 0 0;
                }

                .skill-category-box {
                    margin-bottom: 14px;
                }

                .skill-cat-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: #555;
                    margin: 0 0 6px 0;
                }

                .skill-dot-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    font-size: 11.5px;
                    color: #555;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    padding-left: 10px;
                }

                .skill-dot-list li::before {
                    content: "•";
                    color: #1a73e8;
                    margin-right: 8px;
                    font-weight: bold;
                }

                @media print {
                    .resume-viewer-container { padding: 0; background: white; }
                    .resume-actions-bar { display: none; }
                    .resume-canvas { width: 100%; box-shadow: none; padding: 0; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
