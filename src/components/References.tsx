import { usePortfolio } from '../context/PortfolioContext';

const References = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const references = data.references || [];

    if (references.length === 0) return null;

    return (
        <section id="references" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.references?.subtitle || 'Recommendations'}</span>
                    <h2>
                        {data.sections?.references?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.references.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Professional <span className="gradient-text">References</span></>
                        )}
                    </h2>
                </div>
                <div className="references-grid">
                    {references.map((item, index) => (
                        <div key={index} className="reference-card fade-in" ref={addToRefs}>
                            <div className="ref-avatar">
                                {item.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="ref-content">
                                <h3>{item.name}</h3>
                                <p className="ref-title">{item.title}</p>
                                <p className="ref-company">{item.company}</p>
                                {item.relation && <p className="ref-relation"><span className="badge">Relation</span> {item.relation}</p>}
                                <div className="ref-contact">
                                    <a href={`mailto:${item.email}`} className="ref-link">✉️ {item.email}</a>
                                    {item.phone && <a href={`tel:${item.phone}`} className="ref-link">📞 {item.phone}</a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .references-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 32px; margin-top: 40px; }
                .reference-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 32px; transition: var(--transition); display: flex; align-items: flex-start; gap: 20px; position: relative; overflow: hidden; }
                .reference-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1); }
                .ref-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; color: white; flex-shrink: 0; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); text-transform: uppercase; }
                .ref-content { flex: 1; }
                .ref-content h3 { font-size: 1.2rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
                .ref-title { font-size: 0.95rem; color: var(--primary); font-weight: 600; margin-bottom: 2px; line-height: 1.3; }
                .ref-company { font-size: 0.85rem; color: var(--text-color); margin-bottom: 12px; font-weight: 500; }
                .ref-relation { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
                .ref-relation .badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
                .ref-contact { display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 16px; }
                .ref-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: color 0.2s; }
                .ref-link:hover { color: var(--primary-glow); text-decoration: underline; }
                @media (max-width: 500px) {
                    .reference-card { flex-direction: column; align-items: center; text-align: center; }
                    .ref-contact { align-items: center; }
                    .ref-relation { justify-content: center; }
                }
            `}</style>
        </section>
    );
};

export default References;
