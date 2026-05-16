import { useRef, useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, Loader, Printer, CheckCircle2, AlertCircle, Info, X, Zap, Mail, MapPin, Globe, Briefcase } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const fmtDate = (s: string) => {
    if (!s) return 'Present';
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Resume = () => {
    const { data } = usePortfolio();
    const sheetRef = useRef<HTMLDivElement>(null);
    const [busy, setBusy] = useState(false);
    const [showAts, setShowAts] = useState(false);
    const [cvType, setCvType] = useState<'modern' | 'europass'>('modern');

    // --- ATS SCORING LOGIC ---
    const atsScore = useMemo(() => {
        let score = 50;
        const tips: { type: 'plus' | 'minus' | 'tip', text: string }[] = [];

        if (data.contact.email && data.contact.phone) { score += 10; tips.push({ type: 'plus', text: 'Professional contact info complete.' }); }
        if (data.contact.linkedin && data.contact.github) { score += 5; tips.push({ type: 'plus', text: 'Social professional profiles linked.' }); }
        if (data.about.bio.length > 200) { score += 10; tips.push({ type: 'plus', text: 'Well-defined professional statement.' }); }

        const allText = JSON.stringify(data).toLowerCase();
        const keywords = ['rag', 'llm', 'fastapi', 'python', 'nlp', 'automation', 'scalable', 'deployment'];
        const found = keywords.filter(k => allText.includes(k));
        if (found.length > 4) { score += 10; tips.push({ type: 'plus', text: `Strong keyword density (${found.length} core tags).` }); }
        if (data.work.some(w => w.details.length >= 4)) { score += 10; tips.push({ type: 'plus', text: 'Detailed professional bullet points.' }); }
        if (data.papers && data.papers.length > 0) { score += 20; tips.push({ type: 'plus', text: 'Academic publications found (High Impact).' }); }
        if (data.projects.length >= 3) { score += 5; tips.push({ type: 'plus', text: 'Project portfolio demonstrated.' }); }
        if (data.education.length >= 2) { score += 5; tips.push({ type: 'plus', text: 'Education history complete.' }); }
        if (data.certifications && data.certifications.length > 0) { score += 10; tips.push({ type: 'plus', text: 'Industry certifications verified.' }); }
        if (data.references && data.references.length > 0) { score += 5; tips.push({ type: 'plus', text: `References included (${data.references.length} contact${data.references.length > 1 ? 's' : ''}).` }); }
        score += 5; tips.push({ type: 'plus', text: 'Single-column, ATS-parsable formatting.' });

        return { total: Math.min(score, 100), tips };
    }, [data]);

    const downloadPDF = async () => {
        if (!sheetRef.current) return;
        setBusy(true);
        
        try {
            sheetRef.current.classList.add('pdf-export');
            // Options for html2pdf
            const opt = {
                margin: [13.2, 0, 13.2, 0], // Exactly 50px (at 96dpi) top/bottom margin on every page
                filename: `${data.hero.name.replace(/\s+/g, '_')}_Resume.pdf`,
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { 
                    scale: 3, 
                    useCORS: true, 
                    letterRendering: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 794
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: 'css', avoid: ['.ep-item', '.ep-cert-item'] }
            };

            // Modern way to call html2pdf with full link preservation
            const worker = (html2pdf() as any).set(opt).from(sheetRef.current);
            await worker.toPdf().get('pdf').then((pdf: any) => {
                // ONLY DRAW BARS IF IN EUROPASS MODE
                if (cvType === 'europass') {
                    const totalPages = pdf.internal.getNumberOfPages();
                    const pageWidth = 210; // A4 Width in mm
                    const pageHeight = 297; // A4 Height in mm
                    const barHeight = 8; // mm
                    const barColor = '#a8c4e5';
                    const inset = 6; // mm

                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFillColor(barColor);
                        
                        // TOP BAR
                        pdf.rect(0, 0, pageWidth, barHeight, 'F');
                        pdf.rect(0, 0, inset, barHeight * 2, 'F');
                        pdf.rect(pageWidth - inset, 0, inset, barHeight * 2, 'F');

                        // BOTTOM BAR
                        pdf.rect(0, pageHeight - barHeight, pageWidth, barHeight, 'F');
                        pdf.rect(0, pageHeight - barHeight * 2, inset, barHeight * 2, 'F');
                        pdf.rect(pageWidth - inset, pageHeight - barHeight * 2, inset, barHeight * 2, 'F');
                    }
                }
            }).save();
        } catch (e) { 
            console.error("PDF Download Error:", e); 
            alert("Download failed. Using 'Print CV' is recommended for best quality.");
        } finally { 
            if (sheetRef.current) sheetRef.current.classList.remove('pdf-export');
            setBusy(false); 
        }
    };

    const downloadDynamic = () => {
        window.print();
    };

    const em = data.contact.email || '';
    const ph = data.contact.phone || '';
    const loc = data.contact.location || '';
    const city = loc.split(',')[1]?.trim() || 'Bangladesh';

    const sortedWork = [...data.work].sort((a, b) => {
        if (!a.endDate && b.endDate) return -1;
        if (a.endDate && !b.endDate) return 1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    return (
        <div className="rv-page">
            <div className="rv-toolbar">
                <div className="rv-layout-toggle">
                    <button 
                        onClick={() => setCvType('modern')} 
                        className={`rv-btn ${cvType === 'modern' ? 'rv-active' : ''}`}
                    >
                        Modern Layout
                    </button>
                    <button 
                        onClick={() => setCvType('europass')} 
                        className={`rv-btn ${cvType === 'europass' ? 'rv-active' : ''}`}
                    >
                        Europass (German)
                    </button>
                </div>
                <div style={{ flex: 1 }} />
                <button onClick={() => setShowAts(true)} className="rv-btn rv-solid" style={{ background: '#10b981', border: 'none' }}>
                    <Zap size={14} fill="white" /> Check ATS Score
                </button>
                <button onClick={downloadPDF} disabled={busy} className="rv-btn rv-solid" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                    {busy ? <Loader size={14} className="rv-spin" /> : <Download size={14} />}
                    {busy ? 'Generating…' : 'Download PDF'}
                </button>
                <button onClick={downloadDynamic} className="rv-btn rv-solid" style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                    <Printer size={14} /> Print CV
                </button>
            </div>

            <div className={`rv-sheet ${cvType === 'europass' ? 'ep-sheet' : ''}`} ref={sheetRef}>
                {cvType === 'modern' ? (
                    <div className="rv-content">
                        <div className="rv-hd">
                            <div className="rv-hd-left">
                                <div className="rv-contact-row"><span>{ph}</span></div>
                                <div className="rv-contact-row"><span>{city}</span></div>
                                <div className="rv-contact-row"><a href={`mailto:${em}`}>{em}</a></div>
                            </div>
                            <div className="rv-hd-mid">
                                <h1 className="rv-name">{data.hero.name}</h1>
                                <p className="rv-role">{data.hero.title}</p>
                            </div>
                            <div className="rv-hd-right">
                                <div className="rv-contact-row"><a href="https://shahabdulmazid.vercel.app" target="_blank" rel="noopener noreferrer" className="rv-link">Portfolio: shahabdulmazid.vercel.app</a></div>
                                <div className="rv-contact-row"><a href={data.contact.github} target="_blank" rel="noopener noreferrer" className="rv-link">GitHub: github.com/Shah-Abdul-Mazid</a></div>
                                <div className="rv-contact-row"><a href={data.contact.linkedin} target="_blank" rel="noopener noreferrer" className="rv-link">LinkedIn: linkedin.com/in/shahabdulmazid</a></div>
                            </div>
                        </div>

                        <div className="rv-print-tip" style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center', marginBottom: '8px', fontStyle: 'italic' }}>
                            Note: For active clickable hyperlinks in the PDF, please use the "Print CV" button and select "Save as PDF".
                        </div>

                        <div className="rv-body">
                            {data.about.bio && (
                                <div className="rv-summary">
                                    {data.about.bio.split('\n\n').map((para, i) => (
                                        <p key={i} style={{ marginBottom: i === data.about.bio.split('\n\n').length - 1 ? 0 : '8px' }}>{para}</p>
                                    ))}
                                </div>
                            )}
                            {data.skills.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Skills</div>
                                    {data.skills.map((c, i) => (
                                        <p key={i} className="rv-skill-row"><b>{c.name}:</b> {c.items.join(', ')}</p>
                                    ))}
                                </div>
                            )}
                            {sortedWork.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Technical Experience</div>
                                    {sortedWork.map((w, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{w.role}</span><span className="rv-meta-date">{fmtDate(w.startDate)} — {w.endDate ? fmtDate(w.endDate) : 'Present'}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{w.company}</span><span className="rv-meta">{city}</span></div>
                                            <ul className="rv-ul">{w.details.map((d, j) => <li key={j}>{d}</li>)}</ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.education.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Education</div>
                                    {data.education.map((e, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{e.degree}</span><span className="rv-meta">{e.year}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{e.school}</span><span className="rv-meta">Dhaka, Bangladesh</span></div>
                                            {e.major && <p className="rv-sm" style={{ color: '#4b5563', fontStyle: 'italic', fontSize: '11.5px', marginTop: '2px' }}>• {e.major}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.projects.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Projects</div>
                                    {data.projects.slice(0, 8).map((p, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-proj-hd">
                                                {p.projectUrl ? (
                                                    <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="rv-proj-link-anchor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                        <span className="rv-proj-title">{p.title}</span>
                                                        <span className="rv-proj-link">· {p.projectUrl.replace('https://', '')}</span>
                                                    </a>
                                                ) : (
                                                    <span className="rv-proj-title">{p.title}</span>
                                                )}
                                            </div>
                                            <p className="rv-sm" style={{ color: '#374151', margin: '1px 0 2px' }}>{p.desc}</p>
                                            {p.tags.length > 0 && <p className="rv-sm" style={{ color: '#3d5a80', margin: 0, fontStyle: 'italic', fontSize: '11px' }}>Tech: {p.tags.join(', ')}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.papers && data.papers.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Publications</div>
                                    {data.papers.slice(0, 3).map((p, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{p.title}</span><span className="rv-meta">{p.year}</span></div>
                                            <p className="rv-sm" style={{ color: '#1a1a1a', margin: '2px 0 1px' }}>{p.venue}</p>
                                            {p.link && <p className="rv-sm" style={{ color: '#3d5a80', margin: 0, fontSize: '11px' }}><a href={p.link} target="_blank" rel="noopener noreferrer">{p.link.replace('https://', '')}</a></p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.certifications && data.certifications.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Licenses & Certifications</div>
                                    {data.certifications.map((c, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top">
                                                <span className="rv-bold">{c.name}</span>
                                                <span className="rv-meta">{c.date}</span>
                                            </div>
                                            <div className="rv-item-sub">
                                                <span className="rv-muted">{c.issuer}{c.instructor ? ` | ${c.instructor}` : ''}</span>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {c.credentialUrl && (
                                                        <span className="rv-meta">
                                                            <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3d5a80', textDecoration: 'none' }}>
                                                                {c.credentialId ? `ID: ${c.credentialId}` : 'Show Credential'} ↗
                                                            </a>
                                                        </span>
                                                    )}
                                                    {c.links?.map((link, lIdx) => (
                                                        <span key={lIdx} className="rv-meta">
                                                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3d5a80', textDecoration: 'none', fontStyle: 'italic' }}>
                                                                {link.label || 'Link'} ↗
                                                            </a>
                                                        </span>
                                                    ))}
                                                    {!c.credentialUrl && c.credentialId && (
                                                        <span className="rv-meta">ID: {c.credentialId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.experience && data.experience.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">Competitions & Awards</div>
                                    {data.experience.map((e, i) => (
                                        <div key={i} className="rv-item">
                                            <div className="rv-item-top"><span className="rv-bold">{e.role}</span><span className="rv-meta">{e.period}</span></div>
                                            <div className="rv-item-sub"><span className="rv-muted">{e.company}</span></div>
                                            <p className="rv-sm" style={{ color: '#1a1a1a', margin: '1px 0 0' }}>{e.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="rv-sec">
                                <div className="rv-sec-hd">Languages</div>
                                <p className="rv-skill-row"><b>Bengali:</b> Native &nbsp;·&nbsp; <b>English:</b> Professional Working Proficiency</p>
                            </div>
                            {data.references && data.references.length > 0 && (
                                <div className="rv-sec">
                                    <div className="rv-sec-hd">References</div>
                                    <div className="rv-ref-grid">
                                        {data.references.map((r, i) => (
                                            <div key={i} className="rv-ref-item">
                                                <div className="rv-ref-name">{r.name}</div>
                                                <div className="rv-ref-pos">{r.title}</div>
                                                <div className="rv-ref-org">{r.company}</div>
                                                <div className="rv-ref-rel">{r.relation}</div>
                                                <div className="rv-ref-contact">
                                                    {r.email && <div className="rv-ref-email"><a href={`mailto:${r.email}`} className="rv-ref-link">{r.email}</a></div>}
                                                    {r.phone && <div className="rv-ref-phone">{r.phone}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="ep-content">
                        <div className="ep-frame-top" />
                        <div className="ep-frame-bottom" />
                        <div className="ep-header">
                            <div className="ep-photo">
                                <img src="/Image/FD=109767.jpg" alt="Profile" />
                            </div>
                            <div className="ep-info">
                                <h1 className="ep-name">{data.hero.name}</h1>
                                <div className="ep-details">
                                    <div className="ep-detail-row"><b>Nationality:</b> Bangladeshi <span style={{ marginLeft: '10px' }}><b>Date of birth:</b> 01/06/2001</span></div>
                                    <div className="ep-detail-row"><b>Place of birth:</b> Dhaka, Bangladesh</div>
                                    <div className="ep-detail-row">
                                        <MapPin size={12} fill="#003399" color="white" />
                                        <b>Home:</b> 14/14, Tajmohol Road , Mohammadpur, 1207 Dhaka (Bangladesh)
                                    </div>
                                </div>
                            </div>
                            <div className="ep-logo">
                                <img src="/Logo/Europass-Full-Colour-Brand-Mark_1.svg" alt="Europass Logo" />
                            </div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">ABOUT ME</h2>
                            <div className="ep-sec-line" />
                            <div className="ep-summary-text">{data.about.bio}</div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">EDUCATION AND TRAINING</h2>
                            <div className="ep-sec-line" />
                            {data.education.map((e, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{e.degree}</h3>
                                    <div className="ep-item-org">{e.school}</div>
                                    <div className="ep-item-meta">
                                        <span className="ep-meta-row"><b>Address:</b> Dhaka, Bangladesh</span>
                                        <span className="ep-meta-row"><b>Website:</b> <a href="https://www.ewubd.edu/">https://www.ewubd.edu/</a></span>
                                        <span className="ep-meta-row"><b>Level in EQF:</b> {i === 0 ? 'EQF level 6' : i === 1 ? 'EQF level 4' : 'EQF level 3'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">WORK EXPERIENCE</h2>
                            <div className="ep-sec-line" />
                            {sortedWork.map((w, i) => (
                                <div key={i} className="ep-item">
                                    <div className="ep-company-row">
                                        <Briefcase size={14} fill="#003399" color="white" />
                                        <span className="ep-company">{w.company}</span> — <span className="ep-loc">{city}</span>
                                    </div>
                                    <h3 className="ep-role">{w.role}</h3>
                                    <div className="ep-dates">[ {w.startDate.split('-').reverse().join('/')} – {w.endDate ? w.endDate.split('-').reverse().join('/') : 'Present'} ]</div>
                                    <ul className="ep-bullets">
                                        {w.details.map((d, j) => <li key={j}>{d}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section ep-page-break">
                            <h2 className="ep-sec-title">TECHNICAL SKILLS</h2>
                            <div className="ep-sec-line" />
                            {data.skills.map((cat, i) => (
                                <div key={i} className="ep-lang-row" style={{ marginBottom: '8px' }}>
                                    <b>{cat.name}:</b> {cat.items.join(', ')}
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">DIGITAL SKILLS TEST RESULTS</h2>
                            <div className="ep-sec-line" />
                            {[
                                { name: 'Information and data literacy', level: 'INTERMEDIATE', val: 'Level 3 / 6', icon: <Globe size={14} /> },
                                { name: 'Communication and collaboration', level: 'INTERMEDIATE', val: 'Level 4 / 6', icon: <Mail size={14} /> },
                                { name: 'Digital content creation', level: 'ADVANCED', val: 'Level 5 / 6', icon: <Globe size={14} /> },
                                { name: 'Safety', level: 'INTERMEDIATE', val: 'Level 3 / 6', icon: <CheckCircle2 size={14} /> },
                                { name: 'Problem solving', level: 'INTERMEDIATE', val: 'Level 4 / 6', icon: <Zap size={14} /> }
                            ].map((s, i) => (
                                <div key={i} className="ep-skill-row">
                                    <div className="ep-skill-name">
                                        <span className="ep-skill-icon">{s.icon}</span>
                                        {s.name}
                                    </div>
                                    <div className="ep-skill-level">
                                        <b>{s.level}</b> {s.val}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">LANGUAGE SKILLS</h2>
                            <div className="ep-sec-line" />
                            <div className="ep-lang-row"><b>Mother tongue(s):</b> Bengali</div>
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">PROJECTS</h2>
                            <div className="ep-sec-line" />
                            {data.projects.map((p, i) => (
                                <div key={i} className="ep-item">
                                    <h3 className="ep-item-title">{p.title}</h3>
                                    <div className="ep-item-meta" style={{ marginTop: '2px' }}>
                                        <div style={{ fontSize: '10.5px', color: '#444', marginBottom: '3px' }}>{p.desc}</div>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {p.tags.slice(0, 5).map((t, j) => (
                                                <span key={j} style={{ fontSize: '9px', background: '#f0f4f8', color: '#003399', padding: '1px 5px', borderRadius: '3px' }}>{t}</span>
                                            ))}
                                        </div>
                                        {(p.projectUrl || p.githubUrl) && (
                                            <div className="ep-meta-row" style={{ marginTop: '3px' }}>
                                                <b>Link:</b> <a href={p.projectUrl || p.githubUrl}>{p.projectUrl || p.githubUrl}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ep-section">
                            <h2 className="ep-sec-title">CERTIFICATIONS</h2>
                            <div className="ep-sec-line" />
                            {data.certifications.map((c, i) => (
                                <div key={i} className="ep-cert-item">
                                    <div className="ep-cert-meta">[ {c.issuer}, {c.date.split('-').reverse().join('/')} ]</div>
                                    <div className="ep-cert-name">{c.name}</div>
                                    <div className="ep-cert-mode"><b>Mode of learning:</b> Online</div>
                                    {c.credentialUrl && (
                                        <div className="ep-cert-link">
                                            <b>Link:</b> <a href={c.credentialUrl}>{c.credentialUrl}</a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showAts && (
                <div className="ats-overlay" onClick={() => setShowAts(false)}>
                    <div className="ats-panel" onClick={e => e.stopPropagation()}>
                        <div className="ats-hd">
                            <div className="ats-hd-txt"><h3>ATS Insight Analyzer</h3><p>Real-time professional score</p></div>
                            <button className="ats-close" onClick={() => setShowAts(false)}><X size={20} /></button>
                        </div>
                        <div className="ats-score-box">
                            <div className="ats-circle"><span className="ats-num">{atsScore.total}</span><span className="ats-pct">%</span></div>
                            <div className="ats-label">{atsScore.total >= 80 ? 'Excellent' : atsScore.total >= 60 ? 'Professional' : 'Needs Optimization'}</div>
                        </div>
                        <div className="ats-tips">
                            {atsScore.tips.map((t, i) => (
                                <div key={i} className={`ats-tip ats-${t.type}`}>
                                    {t.type === 'plus' ? <CheckCircle2 size={16} /> : t.type === 'tip' ? <Info size={16} /> : <AlertCircle size={16} />}
                                    <span>{t.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="ats-footer"><p>Calculated based on formatting, keywords, and sections for AI roles.</p></div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                * { box-sizing: border-box !important; }
                @page {
                    size: A4;
                    margin: 0.5in;
                }
                .rv-page { background: #f1f5f9; min-height: 100vh; padding: 32px 16px 60px; display: flex; flex-direction: column; align-items: center; font-family: 'Source Sans Pro', 'Inter', sans-serif; }
                .rv-toolbar { width: min(794px, 100%); display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 16px; }
                .rv-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: all 0.2s; }
                .rv-solid { background: #3d5a80; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
                .rv-solid:hover { background: #2b3f5a; transform: translateY(-1px); }
                .rv-spin { animation: rvSpin 1s linear infinite; }
                @keyframes rvSpin { to { transform: rotate(360deg); } }
                .ep-sheet { border: none !important; }
                .ep-page-break { page-break-before: always !important; }
                .rv-content { padding: 40px !important; overflow-wrap: break-word !important; position: relative; z-index: 2; }
                
                /* Europass Styles */
                .ep-content { padding: 40px 40px !important; color: #333 !important; line-height: 1.4 !important; font-family: 'Arial', sans-serif !important; background: white; position: relative; z-index: 2; }
                .ep-frame-top { position: absolute; top: 0; left: 0; right: 0; height: 35px; background: #a8c4e5; clip-path: polygon(0 0, 100% 0, 100% 100%, 96% 100%, 96% 35%, 4% 35%, 4% 100%, 0 100%); z-index: 3; pointer-events: none; }
                .ep-frame-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 35px; background: #a8c4e5; clip-path: polygon(0 100%, 100% 100%, 100% 0, 96% 0, 96% 65%, 4% 65%, 4% 0, 0 0%); z-index: 3; pointer-events: none; }
                .pdf-export .ep-frame-top, .pdf-export .ep-frame-bottom { display: none !important; }
                .ep-header { display: grid; grid-template-columns: 120px 1fr 120px; align-items: start; gap: 20px; margin-bottom: 25px; margin-top: 10px; position: relative; z-index: 4; }
                .rv-hd { display: grid !important; grid-template-columns: 1.2fr 2fr 1.2fr !important; align-items: center !important; gap: 15px !important; padding-bottom: 15px !important; border-bottom: 1.5px solid #3d5a80 !important; margin-bottom: 12px !important; }
                .rv-hd-left { display: flex !important; flex-direction: column !important; gap: 2px !important; text-align: left !important; font-size: 11px !important; }
                .rv-hd-mid { display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 0; }
                .rv-hd-right { display: flex !important; flex-direction: column !important; gap: 2px !important; text-align: right !important; font-size: 11px !important; }
                .rv-name { font-size: 26px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.1; white-space: nowrap; }
                .rv-role { font-size: 12px; color: #3d5a80; font-weight: 600; margin: 4px 0 0; line-height: 1.3; max-width: 100%; }
                .rv-contact-row { line-height: 1.3; }
                .rv-contact-row a { color: #3d5a80; text-decoration: none; }
                .rv-contact-row a:hover { text-decoration: underline; }
                .rv-link { color: #3d5a80 !important; text-decoration: none !important; font-weight: 600 !important; }
                .rv-link:hover { text-decoration: underline !important; }
                .rv-proj-link-anchor:hover .rv-proj-title { color: #3d5a80; text-decoration: underline; }
                .rv-body { padding: 0; }
                .rv-summary { font-size: 12.5px; color: #1a1a1a; line-height: 1.4; margin: 0 0 10px; text-align: justify; }
                .rv-sec { margin-bottom: 5px !important; min-height: 0 !important; padding: 0 !important; display: block; overflow: visible; break-inside: avoid !important; page-break-inside: avoid !important; }
                .rv-sec-hd { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #3d5a80; margin-bottom: 3px; display: flex; align-items: center; gap: 8px; break-after: avoid !important; page-break-after: avoid !important; }
                .rv-sec-hd::after { content: ""; flex: 1; height: 1px; background: #3d5a80; margin-left: 8px; opacity: 0.3; }
                .rv-skill-row { font-size: 11.5px; margin: 0 0 3px; color: #374151; break-inside: avoid; page-break-inside: avoid; }
                .rv-skill-row b { color: #1a1a1a; }
                .rv-item { margin-bottom: 4px; break-inside: avoid !important; page-break-inside: avoid !important; }
                .rv-item-top { display: flex !important; justify-content: space-between !important; align-items: baseline !important; gap: 10px !important; margin-bottom: 1px !important; text-align: left !important; }
                .rv-item-sub { display: flex !important; justify-content: space-between !important; align-items: baseline !important; gap: 10px !important; margin-bottom: 2px !important; text-align: left !important; }
                .rv-bold { font-weight: 700; font-size: 13px; color: #1a1a1a; }
                .rv-muted { color: #1a1a1a; font-weight: 600; font-size: 12.5px; }
                .rv-sm { font-size: 12px; }
                .rv-meta { font-size: 12px; color: #1a1a1a; font-weight: 600; white-space: nowrap; }
                .rv-meta-date { font-weight: 700; font-size: 12.5px; color: #1a1a1a; }
                .rv-ul { margin: 1px 0 0; padding-left: 14px; list-style: disc; }
                .rv-ul li { font-size: 12px; color: #1a1a1a; margin-bottom: 1px; line-height: 1.3; }
                .rv-proj-hd { display: flex; align-items: baseline; gap: 6px; break-inside: avoid !important; page-break-inside: avoid !important; }
                .rv-proj-title { font-weight: 700; font-size: 13px; color: #1a1a1a; }
                .rv-proj-link { font-size: 11px; color: #3d5a80; font-style: italic; }
                .rv-ref-grid { display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 10px 15px !important; margin-top: 2px !important; }
                .rv-ref-item { border-left: 2px solid #3d5a80 !important; padding-left: 8px !important; break-inside: avoid !important; page-break-inside: avoid !important; }
                .rv-ref-name { font-weight: 700; font-size: 11.5px; color: #1a1a1a; line-height: 1.2; }
                .rv-ref-pos { font-size: 10.5px; color: #3d5a80; font-weight: 600; line-height: 1.2; }
                .rv-ref-org { font-size: 10px; color: #374151; margin-bottom: 1px; }
                .rv-ref-rel { font-size: 9.5px; color: #6b7280; font-style: italic; margin-bottom: 1px; }
                .rv-ref-contact { font-size: 9.5px; color: #374151; }
                .rv-ref-link { color: #3d5a80; text-decoration: none; }
                .rv-ref-link:hover { text-decoration: underline; }
                .rv-ref-phone { color: #374151; }
                .ats-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.3s ease; }
                .ats-panel { width: 100%; max-width: 420px; background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 30px; color: white; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .ats-hd { display: flex; justify-content: space-between; align-items: start; margin-bottom: 25px; }
                .ats-hd h3 { margin: 0; font-size: 1.4rem; color: #10b981; }
                .ats-hd p { margin: 4px 0 0; font-size: 0.9rem; color: #94a3b8; }
                .ats-close { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; transition: color 0.2s; }
                .ats-close:hover { color: white; }
                .ats-score-box { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
                .ats-circle { width: 120px; height: 120px; border: 8px solid #334155; border-top-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; position: relative; }
                .ats-num { font-size: 3rem; font-weight: 800; color: white; }
                .ats-pct { font-size: 1rem; color: #10b981; margin-top: 10px; margin-left: 2px; }
                .ats-label { font-size: 1.1rem; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 1px; }
                .ats-tips { display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px; }
                .ats-tip { display: flex; align-items: center; gap: 10px; font-size: 0.92rem; padding: 10px 14px; border-radius: 12px; background: rgba(255,255,255,0.03); }
                .ats-plus { color: #10b981; border-left: 3px solid #10b981; }
                .ats-tip.ats-tip { color: #38bdf8; border-left: 3px solid #38bdf8; }
                .ats-minus { color: #f43f5e; border-left: 3px solid #f43f5e; }
                .ats-footer { text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; }
                .ats-footer p { font-size: 0.75rem; color: #64748b; margin: 0; line-height: 1.4; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @media print { 
                    @page { size: A4; margin: 0.75in 0.5in; }
                    .rv-page { background: white !important; padding: 0 !important; margin: 0 !important; width: 100% !important; } 
                    .rv-toolbar, .ats-overlay, .rv-print-tip { display: none !important; } 
                    .rv-sheet { box-shadow: none !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; overflow: visible !important; }
                    .rv-content { padding: 0 !important; width: 100% !important; }
                    .rv-hd { grid-template-columns: 1.4fr 2fr 1.4fr !important; gap: 10px !important; }
                    .rv-hd-left, .rv-hd-right { font-size: 10px !important; }
                    .rv-name { font-size: 24px !important; }
                    header, footer, .mobile-drawer { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    .container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    .bu-project { break-before: auto !important; page-break-before: auto !important; }
                    .rv-item, .rv-proj-hd, .rv-ref-item, .rv-skill-row { break-inside: auto !important; page-break-inside: auto !important; }
                    .rv-sec { break-inside: auto !important; page-break-inside: auto !important; margin-bottom: 12px !important; }
                    .rv-sec-hd { break-after: avoid !important; page-break-after: avoid !important; margin-top: 15px !important; }
                    .rv-sec-hd:first-child { margin-top: 0 !important; }
                    .rv-sheet a { pointer-events: auto !important; text-decoration: none !important; }
                }
                .pdf-export .rv-content { padding: 0 !important; }
                .rv-page { background: #5a7da8; min-height: 100vh; padding: 32px 16px 60px; display: flex; flex-direction: column; align-items: center; font-family: 'Source Sans Pro', 'Inter', sans-serif; }
                .rv-toolbar { width: min(850px, 100%); display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 16px; }
                .rv-active { background: #3d5a80 !important; color: white !important; }
                .rv-layout-toggle { display: flex; background: #e2e8f0; padding: 4px; border-radius: 8px; gap: 4px; }
                
                /* Europass Styles */
                .ep-content { padding: 40px !important; color: #333 !important; line-height: 1.4 !important; font-family: 'Arial', sans-serif !important; background: white; }
                .ep-header { display: grid; grid-template-columns: 120px 1fr 120px; align-items: start; gap: 20px; margin-bottom: 25px; }
                .ep-photo { width: 110px; height: 110px; border-radius: 50%; overflow: hidden; border: 1px solid #ddd; flex-shrink: 0; }
                .ep-photo img { width: 100%; height: 100%; object-fit: cover; }
                .ep-photo-placeholder { width: 100%; height: 100%; background: #f0f0f0; }
                .ep-info { display: flex; flex-direction: column; justify-content: center; height: 100%; }
                .ep-name { font-size: 22px; font-weight: bold; color: #003399; margin: 0 0 10px; }
                .ep-details { font-size: 11px; display: flex; flex-direction: column; gap: 3px; color: #333; }
                .ep-detail-row { display: flex; align-items: center; gap: 6px; }
                .ep-logo { width: 110px; flex-shrink: 0; text-align: right; }
                .ep-logo img { width: 100%; height: auto; }
                
                .ep-summary-text { font-size: 11px; color: #333; line-height: 1.5; text-align: justify; }
                .ep-section { margin-bottom: 20px; }
                .ep-sec-title { font-size: 13px; font-weight: bold; color: #003399; margin: 0 0 4px; text-transform: uppercase; }
                .ep-sec-line { height: 1px; background: #ccd1d9; margin-bottom: 12px; }
                
                .ep-item { margin-bottom: 12px; break-inside: avoid !important; page-break-inside: avoid !important; }
                .ep-item-title { font-size: 12px; font-weight: bold; color: #003399; margin: 0 0 1px; }
                .ep-item-org { font-size: 11px; font-weight: bold; font-style: italic; color: #222; margin-bottom: 3px; }
                .ep-item-meta { font-size: 10.5px; display: flex; flex-direction: column; gap: 1px; color: #444; }
                .ep-meta-row { display: block; }
                .ep-item-meta a { color: #003399; text-decoration: none; }
                
                .ep-company-row { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: bold; color: #003399; margin-bottom: 2px; }
                .ep-role { font-size: 12px; font-weight: bold; color: #222; margin: 0 0 2px; }
                .ep-dates { font-size: 10.5px; color: #555; margin-bottom: 5px; }
                .ep-bullets { margin: 0; padding-left: 18px; list-style: disc; }
                .ep-bullets li { font-size: 10.5px; color: #333; margin-bottom: 2px; line-height: 1.4; }
                
                .ep-skill-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #f2f4f7; }
                .ep-skill-name { display: flex; align-items: center; gap: 10px; font-size: 11px; color: #444; }
                .ep-skill-icon { color: #999; display: flex; align-items: center; }
                .ep-skill-level { font-size: 10.5px; color: #333; text-align: right; }
                .ep-skill-level b { color: #003399; font-size: 11px; }
                
                .ep-lang-row { font-size: 11px; color: #333; margin-bottom: 5px; }

                .ep-cert-item { margin-bottom: 12px; break-inside: avoid !important; page-break-inside: avoid !important; }
                .ep-cert-meta { font-size: 10.5px; color: #666; margin-bottom: 2px; }
                .ep-cert-name { font-size: 11.5px; font-weight: bold; color: #003399; margin-bottom: 2px; }
                .ep-cert-mode, .ep-cert-link { font-size: 10.5px; color: #555; }
                .ep-cert-link a { color: #003399; text-decoration: none; word-break: break-all; }

                @media print {
                    .rv-page { background: white !important; padding: 0 !important; }
                    .ep-content { padding: 0 !important; border: none !important; }
                    .ep-name { color: #003399 !important; -webkit-print-color-adjust: exact; }
                    .ep-sec-title { color: #003399 !important; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
