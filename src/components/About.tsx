import { usePortfolio } from '../context/PortfolioContext';
import avtarImg from '../assets/avtar.png';

const About = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();

    return (
        <section id="about" className="about-modern section">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.about?.subtitle || 'About Me'}</span>
                    <h2 className="about-title">
                        {data.sections?.about?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.about.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>A Digital Craftsman with a <span className="gradient-text">Passion</span></>
                        )}
                    </h2>
                </div>

                <div className="about-grid fade-in" ref={addToRefs}>
                    <div className="about-image">
                        <img src={avtarImg} alt="Shah Abdul Mazid" className="img-card" />
                    </div>

                    <div className="about-text">
                        {data.about.bio.split('\n\n').map((para, idx) => (
                            <p key={idx} className={idx === 0 ? "lead" : ""}>{para}</p>
                        ))}

                        <div className="about-stats">
                            <div className="stat">
                                <span className="number">{data.about.age}</span>
                                <span className="label">Age</span>
                            </div>
                            <div className="stat">
                                <span className="number">{data.about.projects}+</span>
                                <span className="label">Projects & Research</span>
                            </div>
                        </div>

                        <a 
                            href="https://github.com/Shah-Abdul-Mazid" 
                            target="_blank" 
                            className="btn-glow"
                        >
                            My GitHub
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .about-modern {
                    background: transparent;
                }

                .section-title {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .subtitle {
                    color: #a855f7;
                    font-weight: 500;
                    letter-spacing: 2px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }

                .about-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.4;
                }

                .gradient-text {
                    background: linear-gradient(90deg, #8b5cf6, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .about-grid {
                    display: flex;
                    align-items: center;
                    gap: 60px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .about-image {
                    flex: 1 1 250px;
                    display: flex;
                    justify-content: center;
                }

                .img-card {
                    width: 100%;
                    max-width: 300px;
                    /* Organic floating shape instead of a square box */
                    clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%);
                    /* Alternatively use a circle/blob */
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    box-shadow: 0 0 50px rgba(0, 247, 255, 0.3);
                    opacity: 0.85; /* Transparency to blend with space */
                    mix-blend-mode: luminosity; /* Helps integrate the blue background into the dark space */
                    transition: 0.5s ease;
                }
                .img-card:hover {
                    opacity: 1;
                    mix-blend-mode: normal;
                    border-radius: 20px;
                }

                .about-text {
                    flex: 1 1 400px;
                    color: #aaa;
                }

                .about-text p.lead {
                    font-size: 1.1rem;
                    color: #fff;
                    margin-bottom: 1rem;
                }

                .about-stats {
                    display: flex;
                    gap: 80px;
                    margin: 30px 0;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .number {
                    font-size: 3rem;
                    font-weight: 800;
                    background: linear-gradient(90deg, #8b5cf6, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .label {
                    font-size: 0.9rem;
                    color: #888;
                    margin-top: 5px;
                }

                .btn-glow {
                    display: inline-block;
                    padding: 14px 32px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #7c3aed, #a855f7);
                    color: #fff;
                    font-weight: 600;
                    text-decoration: none;
                    transition: 0.3s ease;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
                }

                .btn-glow:hover {
                    transform: translateY(-2px) scale(1.03);
                    box-shadow: 0 0 30px rgba(168, 85, 247, 0.9);
                }

                @media (max-width: 768px) {
                    .about-title {
                        font-size: 1.8rem;
                    }
                    .number {
                        font-size: 2.2rem;
                    }
                    .about-stats {
                        gap: 40px;
                    }
                }
            `}</style>
        </section>
    );
};

export default About;