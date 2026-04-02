import { usePortfolio } from '../context/PortfolioContext';

const Skills = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const categories = data.skills;

    return (
        <section id="skills" className="section alt-bg">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.skills?.subtitle || 'Technical Stack'}</span>
                    <h2>
                        {data.sections?.skills?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.skills.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Core <span className="gradient-text">Expertise</span></>
                        )}
                    </h2>
                </div>
                
                <div className="skills-marquee-container">
                    <div className="skills-marquee">
                        {[...categories, ...categories].map((cat, index) => (
                            <div key={index} className="skills-group">
                                <h3>{cat.name}</h3>
                                <ul className="skill-list">
                                    {cat.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                .skills-marquee-container { 
                    margin-top: 20px; 
                    padding: 20px 0;
                    position: relative;
                }
                .skills-marquee { 
                    display: flex; 
                    gap: 24px; 
                    animation: slide 40s linear infinite; 
                    width: max-content;
                }
                .skills-group { 
                    background: var(--card-bg); 
                    border: 1px solid var(--border-color); 
                    padding: 32px; 
                    border-radius: 28px; 
                    min-width: 280px;
                    max-width: 320px;
                    transition: var(--transition);
                }
                .skills-group:hover { border-color: var(--primary); transform: translateY(-10px); }
                .skills-group h3 { font-size: 1rem; color: var(--primary); margin-bottom: 20px; font-weight: 700; }
                .skill-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
                .skill-list li { color: var(--text-secondary); font-weight: 500; display: flex; align-items: center; gap: 8px; font-size: 0.9375rem; }
                .skill-list li::before { content: '•'; color: var(--primary); font-size: 1.5rem; line-height: 0; }
                @keyframes slide {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .skills-marquee:hover { animation-play-state: paused; }

                @media (max-width: 600px) {
                    .skills-group { min-width: 220px; padding: 24px 20px; border-radius: 20px; }
                    .skills-marquee { gap: 16px; }
                    .skills-marquee-container { margin-top: 40px; padding: 30px 0; }
                }
            `}</style>
        </section>
    );
};

export default Skills;
