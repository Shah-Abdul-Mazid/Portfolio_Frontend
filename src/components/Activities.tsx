import { usePortfolio } from '../context/PortfolioContext';

const Activities = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const activities = data.activities || [];

    if (activities.length === 0) return null;

    return (
        <section id="activities" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.activities?.subtitle || 'Involvement'}</span>
                    <h2>
                        {data.sections?.activities?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.activities.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Extracurricular <span className="gradient-text">Activities</span></>
                        )}
                    </h2>
                </div>
                <div className="card-stack">
                    {activities.map((item, index) => (
                        <div key={index} className="unified-card fade-in" ref={addToRefs}>
                            <div className="card-header">
                                <div className="card-title-group">
                                    <h3 className="card-title">{item.role}</h3>
                                    <p className="card-subtitle">{item.organization}</p>
                                </div>
                                <div className="card-meta">
                                    <span className="card-period">{item.period}</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="card-content">
                                    <p className="card-list-alt">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .card-stack { max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
                .unified-card { background: var(--card-bg); border: 1px solid var(--border-color); padding: 24px; border-radius: 16px; transition: var(--transition); position: relative; }
                .unified-card:hover { border-color: var(--primary); transform: translateY(-2px); }
                
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 20px; }
                .card-title { font-size: 1.2rem; color: #fff; margin: 0 0 4px 0; font-weight: 700; }
                .card-subtitle { color: var(--primary); font-weight: 700; font-size: 0.95rem; margin: 0; }
                
                .card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                .card-period { background: rgba(139,92,246,0.08); color: var(--primary); padding: 2px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(139,92,246,0.2); }

                .card-body { display: flex; gap: 24px; align-items: center; justify-content: space-between; }
                .card-content { flex: 1; min-width: 250px; }
                .card-list-alt { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.6; margin: 0; }

                @media (max-width: 768px) {
                    .unified-card { padding: 16px; }
                    .card-header { flex-direction: column; gap: 8px; }
                    .card-meta { align-items: flex-start; }
                }
            `}</style>
        </section>
    );
};

export default Activities;
