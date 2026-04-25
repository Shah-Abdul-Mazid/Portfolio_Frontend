import { useRef, useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Download, Loader, Printer, CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
            const canvas = await html2canvas(sheetRef.current, {
                scale: 4,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200,
                onclone: (clonedDoc) => {
                    const sheet = clonedDoc.querySelector('.rv-sheet') as HTMLElement;
                    if (sheet) {
                        sheet.style.width = '794px';
                        sheet.style.padding = '0';
                        sheet.style.margin = '0';
                        sheet.style.boxSizing = 'border-box';
                    }

                    const buItem = clonedDoc.querySelector('.bu-project') as HTMLElement | null;
                    if (buItem) {
                        buItem.style.marginTop = '10px';
                    }

                    const header = clonedDoc.querySelector('header') as HTMLElement | null;
                    if (header) header.style.display = 'none';
                    const drawer = clonedDoc.querySelector('.mobile-drawer') as HTMLElement | null;
                    if (drawer) drawer.style.display = 'none';
                }
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`${data.hero.name.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (e) { console.error(e); }
        finally { setBusy(false); }
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
                <button onClick={() => setShowAts(true)} className="rv-btn rv-solid" style={{ background: '#10b981', border: 'none' }}>
                    <Zap size={14} fill="white" /> Check ATS Score
                </button>
                <button onClick={downloadPDF} disabled={busy} className="rv-btn rv-solid" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                    {busy ? <Loader size={14} className="rv-spin" /> : <Download size={14} />}
                    {busy ? 'Generating…' : 'Download PDF'}
                </button>
                <button onClick={downloadDynamic} className="rv-btn rv-solid" style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                    <Printer size={14} /> Print CV (Recommended for active links)
                </button>
            </div>

            <div className="rv-sheet" ref={sheetRef}>
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
                .rv-sheet { width: 100% !important; max-width: 210mm !important; margin: 0 auto !important; background: white !important; color: #1a1a1a !important; font-size: 13.5px !important; line-height: 1.4 !important; padding: 0 !important; box-shadow: 0 4px 24px rgba(0,0,0,0.1) !important; text-align: left !important; }
                .rv-content { padding: 0.5in !important; overflow-wrap: break-word !important; }
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
                .rv-sec { margin-bottom: 5px !important; min-height: 0 !important; padding: 0 !important; display: block; overflow: visible; }
                .rv-sec-hd { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #3d5a80; margin-bottom: 3px; display: flex; align-items: center; gap: 8px; break-after: avoid; page-break-after: avoid; }
                .rv-sec-hd::after { content: ""; flex: 1; height: 1px; background: #3d5a80; margin-left: 8px; opacity: 0.3; }
                .rv-skill-row { font-size: 11.5px; margin: 0 0 3px; color: #374151; break-inside: avoid; page-break-inside: avoid; }
                .rv-skill-row b { color: #1a1a1a; }
                .rv-item { margin-bottom: 4px; }
                .rv-item-top { display: flex !important; justify-content: space-between !important; align-items: baseline !important; gap: 10px !important; margin-bottom: 1px !important; text-align: left !important; }
                .rv-item-sub { display: flex !important; justify-content: space-between !important; align-items: baseline !important; gap: 10px !important; margin-bottom: 2px !important; text-align: left !important; }
                .rv-bold { font-weight: 700; font-size: 13px; color: #1a1a1a; }
                .rv-muted { color: #1a1a1a; font-weight: 600; font-size: 12.5px; }
                .rv-sm { font-size: 12px; }
                .rv-meta { font-size: 12px; color: #1a1a1a; font-weight: 600; white-space: nowrap; }
                .rv-meta-date { font-weight: 700; font-size: 12.5px; color: #1a1a1a; }
                .rv-ul { margin: 1px 0 0; padding-left: 14px; list-style: disc; }
                .rv-ul li { font-size: 12px; color: #1a1a1a; margin-bottom: 1px; line-height: 1.3; }
                .rv-proj-hd { display: flex; align-items: baseline; gap: 6px; }
                .rv-proj-title { font-weight: 700; font-size: 13px; color: #1a1a1a; }
                .rv-proj-link { font-size: 11px; color: #3d5a80; font-style: italic; }
                .rv-ref-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 15px; margin-top: 2px; }
                .rv-ref-item { border-left: 2px solid #3d5a80; padding-left: 8px; }
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
                    .rv-page { background: white !important; padding: 0 !important; margin: 0 !important; width: 100% !important; } 
                    .rv-toolbar, .ats-overlay, .rv-print-tip { display: none !important; } 
                    .rv-sheet { box-shadow: none !important; width: 210mm !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; overflow: hidden !important; }
                    .rv-content { padding: 0.5in !important; width: 100% !important; }
                    .rv-hd { grid-template-columns: 1.4fr 2fr 1.4fr !important; gap: 10px !important; }
                    .rv-hd-left, .rv-hd-right { font-size: 10px !important; }
                    .rv-name { font-size: 24px !important; }
                    header, footer, .mobile-drawer { display: none !important; }
                    main { padding: 0 !important; margin: 0 !important; }
                    .container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    .bu-project { break-before: auto !important; page-break-before: auto !important; }
                    .rv-sec { break-inside: auto !important; page-break-inside: auto !important; margin-bottom: 12px !important; }
                    .rv-item, .rv-ref-item, .rv-skill-row { break-inside: auto !important; page-break-inside: auto !important; }
                }
            `}</style>
        </div>
    );
};

export default Resume;
