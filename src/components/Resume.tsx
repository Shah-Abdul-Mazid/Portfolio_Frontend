import { useRef } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Download } from 'lucide-react';
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
        <div className="resume-modern-wrapper">
            <div className="resume-actions">
                <button onClick={downloadPDF} className="btn-vibe-download">
                    <Download size={18} />
                    Download PDF
                </button>
            </div>

            <div className="resume-modern-canvas" ref={resumeRef}>
                {/* LEFT SIDEBAR */}
                <aside className="modern-sidebar">
                    <div className="sidebar-photo-section">
                        <div className="photo-container-dark">
                            <img 
                                src={data.hero.avatarUrl ? resolveUrl(data.hero.avatarUrl) : '/assets/avtar.png'} 
                                alt={data.hero.name} 
                                crossOrigin="anonymous"
                            />
                        </div>
                    </div>

                    <div className="sidebar-content">
                        <div className="sidebar-group">
                            <div className="s-icon-row"><MapPin size={12} className="white-icon" /> <span>{data.contact.location}</span></div>
                            <div className="s-icon-row"><Phone size={12} className="white-icon" /> <span>{data.contact.phone}</span></div>
                            <div className="s-icon-row"><Mail size={12} className="white-icon" /> <span className="small-text">{data.contact.email}</span></div>
                        </div>

                        <div className="sidebar-divider"></div>

                        <div className="sidebar-group">
                            <h3 className="sidebar-title">PROFESSIONAL SUMMARY</h3>
                            <p className="summary-text">{data.about.bio}</p>
                        </div>

                        {/* SKILLS in Sidebar as per common sidebar templates */}
                        <div className="sidebar-divider"></div>
                        <div className="sidebar-group">
                            <h3 className="sidebar-title">SKILLS</h3>
                            {data.skills.map((cat, i) => (
                                <div key={i} className="skill-tag-sidebar">
                                    <strong>{cat.name}:</strong> {cat.items.join(', ')}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="modern-main">
                    <header className="main-header">
                        <h1 className="main-name">{data.hero.name}</h1>
                        <p className="main-headline">{data.hero.title}</p>
                    </header>

                    <section className="main-section">
                        <h2 className="section-title">WORK EXPERIENCE</h2>
                        <div className="section-hr"></div>
                        {data.work.map((w, i) => (
                            <div key={i} className="main-item">
                                <p className="item-dates">{formatDate(w.startDate)} — {w.endDate ? formatDate(w.endDate) : 'Present'}</p>
                                <h3 className="item-title">{w.role}, <span className="comp-name">{w.company}</span> | <span className="loc-name">Dhaka</span></h3>
                                <ul className="item-bullets">
                                    {w.details.map((d, di) => <li key={di}>{d}</li>)}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="main-section">
                        <h2 className="section-title">EDUCATION</h2>
                        <div className="section-hr"></div>
                        {data.education.map((e, i) => (
                            <div key={i} className="main-item">
                                <p className="item-dates">{e.year}</p>
                                <h3 className="item-title">{e.degree}, <span className="comp-name">{e.school}</span></h3>
                                {e.major && <p className="item-subtitle">Major in {e.major}</p>}
                            </div>
                        ))}
                    </section>

                    <section className="main-section">
                        <h2 className="section-title">PROJECTS & RESEARCH</h2>
                        <div className="section-hr"></div>
                        <ul className="item-bullets condensed">
                            {data.papers.slice(0, 3).map((p, i) => (
                                <li key={`p-${i}`}><strong>Research:</strong> {p.title}</li>
                            ))}
                            {data.projects.slice(0, 3).map((pr, i) => (
                                <li key={`pr-${i}`}><strong>Project:</strong> {pr.title}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="main-section">
                        <h2 className="section-title">LANGUAGES</h2>
                        <div className="section-hr"></div>
                        <div className="lang-grid">
                            <div className="lang-item"><span>Bangla</span> <strong>Native</strong></div>
                            <div className="lang-item"><span>English</span> <strong>Native</strong></div>
                        </div>
                    </section>
                </main>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');

                .resume-modern-wrapper {
                    padding: 50px 20px;
                    background: #f0f2f5;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: 'Roboto', sans-serif;
                }

                .resume-actions {
                    width: 210mm;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: flex-end;
                }

                .btn-vibe-download {
                    background: #4a9eba;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(74, 158, 186, 0.3);
                    transition: 0.3s;
                }

                .btn-vibe-download:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(74, 158, 186, 0.4); }

                .resume-modern-canvas {
                    width: 210mm;
                    min-height: 297mm;
                    background: white;
                    display: flex;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                }

                /* SIDEBAR STYLES */
                .modern-sidebar {
                    width: 75mm;
                    background: #4a9eba;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-photo-section {
                    background: #3d464d;
                    padding: 30px;
                    display: flex;
                    justify-content: center;
                }

                .photo-container-dark {
                    width: 130px;
                    height: 160px;
                    background: #fff;
                    padding: 5px;
                    border-radius: 2px;
                }

                .photo-container-dark img { width: 100%; height: 100%; object-fit: cover; }

                .sidebar-content { padding: 30px; }

                .sidebar-group { margin-bottom: 25px; }

                .s-icon-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    font-size: 11px;
                    font-weight: 400;
                }

                .white-icon { color: #fff; opacity: 0.9; }

                .sidebar-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.3);
                    margin-bottom: 25px;
                }

                .sidebar-title {
                    font-size: 14px;
                    font-weight: 900;
                    margin: 0 0 15px 0;
                    letter-spacing: 1px;
                }

                .summary-text {
                    font-size: 10.5px;
                    line-height: 1.6;
                    opacity: 0.95;
                    text-align: justify;
                }

                .skill-tag-sidebar {
                    font-size: 10px;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    opacity: 0.9;
                }

                /* MAIN STYLES */
                .modern-main {
                    flex: 1;
                    padding: 40px 35px;
                    display: flex;
                    flex-direction: column;
                }

                .main-header { margin-bottom: 40px; }

                .main-name {
                    font-size: 42px;
                    font-weight: 900;
                    color: #4a9eba;
                    margin: 0 0 4px 0;
                    letter-spacing: -1px;
                }

                .main-headline {
                    font-size: 18px;
                    font-weight: 700;
                    color: #333;
                    opacity: 0.8;
                }

                .main-section { margin-bottom: 30px; }

                .section-title {
                    font-size: 16px;
                    font-weight: 900;
                    color: #111;
                    margin: 0 0 5px 0;
                    letter-spacing: 0.5px;
                }

                .section-hr {
                    height: 2px;
                    background: #4a9eba;
                    width: 100%;
                    margin-bottom: 15px;
                    opacity: 0.6;
                }

                .main-item { margin-bottom: 18px; }

                .item-dates {
                    font-size: 10px;
                    color: #777;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .item-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #333;
                    margin: 0 0 6px 0;
                }

                .comp-name { color: #4a9eba; }
                .loc-name { color: #888; font-weight: 400; }

                .item-subtitle {
                    font-size: 11px;
                    color: #555;
                    font-weight: 500;
                    margin-top: -3px;
                }

                .item-bullets {
                    margin: 0;
                    padding-left: 15px;
                    font-size: 10.5px;
                    color: #444;
                    line-height: 1.6;
                }

                .item-bullets li { margin-bottom: 4px; }
                .item-bullets.condensed li { margin-bottom: 2px; }

                .lang-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .lang-item {
                    font-size: 11px;
                    display: flex;
                    justify-content: space-between;
                    background: #f8f9fa;
                    padding: 8px 12px;
                    border-radius: 4px;
                }

                .small-text { font-size: 9.5px; }

                @media print {
                    .resume-modern-wrapper { padding: 0; background: white; }
                    .resume-actions { display: none; }
                    .resume-modern-canvas { box-shadow: none; border: none; width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
