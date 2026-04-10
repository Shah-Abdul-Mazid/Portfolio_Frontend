import { useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download } from 'lucide-react';
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
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="resume-kuster-view">
            <div className="resume-kuster-actions">
                <button onClick={downloadPDF} className="btn-kuster-download">
                    <Download size={18} />
                    <span>Download PDF Resume</span>
                </button>
            </div>

            <div className="resume-kuster-container" ref={resumeRef}>
                {/* TITLE HEADLINE */}
                <div className="kuster-header">
                    <div className="header-title-box">
                        <span className="huge-name">{data.hero.name.toUpperCase()}</span>
                        <div className="vertical-rule"></div>
                        <span className="resume-title-text">RESUME</span>
                    </div>
                    <p className="subtitle-text">{data.hero.title}</p>
                </div>

                {/* META SECTION */}
                <div className="kuster-meta">
                    <div className="meta-row">
                        <div className="meta-left"><strong>Status:</strong> Artificial Intelligence Engineer</div>
                        <div className="meta-right">{data.contact.location}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-left"><strong>Fields:</strong> AI, ML, Software Engineering, CV</div>
                        <div className="meta-right">github.com/{data.contact.github?.split('/').pop()}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-left"><strong>Techs:</strong> {data.skills[0]?.items.slice(0, 6).join(', ')}</div>
                        <div className="meta-right">{data.contact.email}</div>
                    </div>
                    <div className="meta-row">
                        <div className="meta-left"><strong>Activities:</strong> {data.activities[0]?.organization || 'Open Source Contribution'}</div>
                        <div className="meta-right">{data.contact.phone}</div>
                    </div>
                    <div className="meta-hr"></div>
                </div>

                {/* SUMMARY */}
                <section className="kuster-section">
                    <h2 className="section-headline">Summary</h2>
                    <p className="summary-p">{data.about.bio}</p>
                </section>

                {/* EXPERIENCE */}
                <section className="kuster-section">
                    <h2 className="section-headline">Experience</h2>
                    {data.work.map((w, i) => (
                        <div key={i} className="kuster-event">
                            <div className="event-top">
                                <span className="event-name"><strong>{w.role}</strong> - <span className="inst-name">{w.company}</span></span>
                                <span className="event-date">{formatDate(w.startDate)} - {w.endDate ? formatDate(w.endDate) : 'present'}</span>
                            </div>
                            <div className="event-hr"></div>
                            <ul className="event-bullets">
                                {w.details.map((d, di) => <li key={di}>{d}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                {/* EDUCATION */}
                <section className="kuster-section">
                    <h2 className="section-headline">Education</h2>
                    {data.education.map((e, i) => (
                        <div key={i} className="kuster-event">
                            <div className="event-top">
                                <span className="event-name"><strong>{e.degree}</strong> - <span className="inst-name">{e.school}</span></span>
                                <span className="event-date">{e.year}</span>
                            </div>
                            <div className="event-hr"></div>
                            <p className="edu-desc">{e.major ? `Major in ${e.major}` : ''}</p>
                        </div>
                    ))}
                </section>

                {/* PROJECTS (as optional extra section) */}
                <section className="kuster-section">
                    <h2 className="section-headline">Projects & Publications</h2>
                    <ul className="footer-bullets">
                        {data.projects.slice(0, 4).map((p, i) => (
                            <li key={i}>{p.title}</li>
                        ))}
                    </ul>
                </section>

                {/* ARTIFICIAL FOOTER */}
                <div className="kuster-footer-box">
                    <span>{data.contact.github}</span>
                    <span className="dot">•</span>
                    <span>{data.contact.linkedin}</span>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap');

                .resume-kuster-view {
                    padding: 40px 10px;
                    background: #f4f4f4;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: 'Raleway', sans-serif;
                }

                .resume-kuster-actions {
                    width: 210mm;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: flex-end;
                }

                .btn-kuster-download {
                    background: #0096ff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .resume-kuster-container {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    padding: 12.5mm 15mm;
                    box-sizing: border-box;
                    color: #111;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    line-height: 1.4;
                }

                .kuster-header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .header-title-box {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }

                .huge-name {
                    font-size: 38px;
                    font-weight: 300;
                    letter-spacing: 2px;
                }

                .vertical-rule {
                    width: 1mm;
                    height: 10mm;
                    background: #0096ff;
                }

                .resume-title-text {
                    font-size: 38px;
                    font-weight: 300;
                    letter-spacing: 2px;
                }

                .subtitle-text {
                    font-size: 13px;
                    margin-top: 5px;
                    font-weight: 500;
                    text-transform: uppercase;
                }

                .kuster-meta {
                    margin-bottom: 20px;
                }

                .meta-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    margin-bottom: 2px;
                }

                .meta-left { font-weight: 400; }
                .meta-right { font-weight: 700; text-align: right; }

                .meta-hr {
                    height: 1px;
                    background: #e1e1e1;
                    margin-top: 6px;
                }

                .kuster-section {
                    margin-bottom: 20px;
                }

                .section-headline {
                    color: #0096ff;
                    font-size: 18px;
                    font-weight: 800;
                    text-align: center;
                    margin: 0 0 10px 0;
                }

                .summary-p {
                    font-size: 11.5px;
                    text-align: justify;
                }

                .kuster-event {
                    margin-bottom: 12px;
                }

                .event-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                }

                .event-name { font-weight: 400; }
                .inst-name { color: #6e6e6e; }
                .event-date { color: #0096ff; font-weight: 600; }

                .event-hr {
                    height: 1px;
                    background: #e1e1e1;
                    margin: 2px 0 6px 0;
                }

                .event-bullets {
                    padding-left: 15px;
                    margin: 0;
                    font-size: 11px;
                    color: #333;
                }

                .event-bullets li::marker { content: "• "; color: #333; }
                .event-bullets li { margin-bottom: 2px; }

                .edu-desc {
                    font-size: 11px;
                    margin: 0;
                    padding-left: 10px;
                    font-style: italic;
                }

                .footer-bullets {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 5px;
                    font-size: 11px;
                    padding-left: 15px;
                }

                .kuster-footer-box {
                    margin-top: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 15px;
                    font-size: 11px;
                    color: #0096ff;
                }

                .dot { font-weight: 900; }

                @media print {
                    .resume-kuster-view { padding: 0; background: white; }
                    .resume-kuster-actions { display: none; }
                    .resume-kuster-container { box-shadow: none; border: none; padding: 0; width: 100%; min-height: auto; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
