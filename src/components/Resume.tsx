import { useRef } from 'react'; // Refined imports for build
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
                scale: 3,
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
        <div className="resume-viewer-wrapper">
            <div className="resume-toolbar">
                <button onClick={downloadPDF} className="btn-save-pdf">
                    <Download size={18} />
                    Download PDF Resume
                </button>
            </div>

            <div className="resume-container" ref={resumeRef}>
                {/* Header: Name and Photo */}
                <div className="resume-top-section">
                    <div className="header-text">
                        <h1 className="name-main">{data.hero.name}</h1>
                        <p className="headline-main">{data.hero.title}</p>
                        <p className="school-main">{data.education[0]?.school || 'East West University'}</p>
                        
                        <div className="contact-list">
                            <div className="c-row">
                                <div className="c-cell"><MapPin size={11} className="blue-icon" /> <span>{data.contact.location}</span></div>
                            </div>
                            <div className="c-row">
                                <div className="c-cell"><Mail size={11} className="blue-icon" /> <span>{data.contact.email}</span></div>
                                <div className="c-cell"><Phone size={11} className="blue-icon" /> <span>{data.contact.phone}</span></div>
                            </div>
                            <div className="c-row">
                                <div className="c-cell"><Linkedin size={11} className="blue-icon" /> <span>{data.contact.linkedin?.split('/').pop() || data.hero.name}</span></div>
                                <div className="c-cell"><Github size={11} className="blue-icon" /> <span>github.com/{data.contact.github?.split('/').pop() || data.hero.name}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="header-photo-box">
                        <div className="photo-inner">
                            <img 
                                src={data.hero.avatarUrl ? resolveUrl(data.hero.avatarUrl) : '/assets/avtar.png'} 
                                alt={data.hero.name} 
                                crossOrigin="anonymous"
                            />
                        </div>
                    </div>
                </div>

                <div className="resume-grid-layout">
                    {/* LEFT COLUMN: 60% */}
                    <div className="column-main">
                        <section className="res-block">
                            <h2 className="res-header">Professional Experience</h2>
                            {data.work.map((w, i) => (
                                <div key={i} className="res-item">
                                    <h3 className="res-item-h1">{w.role}</h3>
                                    <p className="res-item-h2">{w.company}</p>
                                    <div className="res-meta">
                                        <span>📅 {formatDate(w.startDate)} – {w.endDate ? formatDate(w.endDate) : 'Present'}</span>
                                        <span>📍 Dhaka, Bangladesh</span>
                                    </div>
                                    <ul className="res-list">
                                        {w.details.map((d, di) => <li key={di}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section className="res-block">
                            <h2 className="res-header">Education</h2>
                            {data.education.map((e, i) => (
                                <div key={i} className="res-item">
                                    <h3 className="res-item-h1">{e.degree}</h3>
                                    <p className="res-item-h2">{e.school} {e.major ? `- ${e.major}` : ''}</p>
                                    <div className="res-meta">
                                        <span>📅 {e.year}</span>
                                        <span>📍 Dhaka, Bangladesh</span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className="res-block">
                            <h2 className="res-header">Achievements</h2>
                            {data.experience.map((ex, i) => (
                                <div key={i} className="res-item tight">
                                    <h3 className="res-item-h1">{ex.role}</h3>
                                    <p className="res-desc">{ex.desc}</p>
                                </div>
                            ))}
                        </section>

                        <section className="res-block">
                            <h2 className="res-header">Extra-Curricular Activities</h2>
                            <ul className="res-list wide-spacing">
                                {data.activities.map((act, i) => (
                                    <li key={i}>
                                        <strong>{act.role}</strong> at {act.organization}.
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: 40% */}
                    <div className="column-side">
                        <section className="res-block">
                            <h2 className="res-header">Technical Skills</h2>
                            {data.skills.map((s, i) => (
                                <div key={i} className="res-skill-cat">
                                    <p className="res-skill-p">{s.name}</p>
                                    <ul className="res-skill-ul">
                                        {s.items.map((it, ii) => <li key={ii}>{it}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        <section className="res-block">
                            <h2 className="res-header">Research Papers</h2>
                            <ul className="res-list">
                                {data.papers.map((p, i) => <li key={i}>{p.title}</li>)}
                            </ul>
                        </section>

                        <section className="res-block">
                            <h2 className="res-header">Projects</h2>
                            <ul className="res-list">
                                {data.projects.map((pr, i) => <li key={i}>{pr.title}</li>)}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700;800&display=swap');

                .resume-viewer-wrapper {
                    padding: 40px 10px;
                    background: #525659;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .resume-toolbar {
                    width: 210mm;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: flex-end;
                }

                .btn-save-pdf {
                    background: #1a73e8;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .resume-container {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    padding: 12mm 15mm;
                    box-sizing: border-box;
                    color: #333;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    line-height: 1.25;
                }

                .resume-top-section {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 25px;
                }

                .header-text { flex: 1; }

                .name-main {
                    font-size: 38px;
                    font-weight: 800;
                    color: #2c3e50;
                    margin: 0 0 4px 0;
                    text-transform: uppercase;
                    letter-spacing: -0.5px;
                }

                .headline-main {
                    font-size: 16px;
                    color: #1a73e8;
                    font-weight: 700;
                    margin: 0 0 2px 0;
                }

                .school-main {
                    font-size: 16px;
                    color: #1a73e8;
                    font-weight: 700;
                    margin: 0 0 12px 0;
                }

                .contact-list {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }

                .c-row { display: flex; gap: 20px; }

                .c-cell {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 11.5px;
                    color: #555;
                    font-weight: 600;
                }

                .blue-icon { color: #1a73e8; flex-shrink: 0; }

                .header-photo-box {
                    width: 100px;
                    height: 120px;
                    background: #eee;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 5px;
                }

                .photo-inner img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .resume-grid-layout {
                    display: flex;
                    gap: 30px;
                }

                .column-main { flex: 1.5; }
                .column-side { flex: 1; }

                .res-block { margin-bottom: 20px; }

                .res-header {
                    font-size: 20px;
                    font-weight: 800;
                    color: #2c3e50;
                    border-bottom: 2px solid #1a73e8;
                    padding-bottom: 1px;
                    margin: 0 0 12px 0;
                    text-transform: capitalize;
                }

                .res-item { margin-bottom: 14px; }
                .res-item.tight { margin-bottom: 6px; }

                .res-item-h1 {
                    font-size: 14px;
                    font-weight: 700;
                    color: #444;
                    margin: 0 0 1px 0;
                }

                .res-item-h2 {
                    font-size: 13.5px;
                    color: #1a73e8;
                    font-weight: 700;
                    margin: 0 0 3px 0;
                }

                .res-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #888;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                .res-list {
                    margin: 0;
                    padding-left: 14px;
                    font-size: 11.5px;
                    color: #444;
                    line-height: 1.4;
                }

                .res-list.wide-spacing li { margin-bottom: 6px; }

                .res-desc {
                    font-size: 11.5px;
                    color: #555;
                    margin: 2px 0 0 0;
                }

                .res-skill-cat { margin-bottom: 10px; }

                .res-skill-p {
                    font-size: 12px;
                    font-weight: 700;
                    color: #666;
                    margin: 0 0 3px 0;
                }

                .res-skill-ul {
                    list-style: none;
                    margin: 0;
                    padding-left: 10px;
                    font-size: 11px;
                    color: #555;
                }

                .res-skill-ul li::before {
                    content: "•";
                    color: #1a73e8;
                    font-weight: bold;
                    margin-right: 8px;
                }

                @media print {
                    .resume-viewer-wrapper { padding: 0; background: white; }
                    .resume-toolbar { display: none; }
                    .resume-container { box-shadow: none; border: none; padding: 0; margin: 0; width: 100%; min-height: auto; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
