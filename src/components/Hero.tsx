import { usePortfolio } from '../context/PortfolioContext';
import avtarImg from '../assets/avtar.png';

const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    
    return (
        <section id="hero" className="hero section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '120px' }}>
            <div className="container">
                <div className="hero-image fade-in" ref={addToRefs} style={{ marginBottom: '32px' }}>
                    <div className="image-wrapper">
                        <img src={avtarImg} alt="Shah Abdul Mazid" />
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="badge fade-in" ref={addToRefs}>Available for new opportunities</div>
                    <h1 className="fade-in" ref={addToRefs} style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, margin: '16px 0' }}>
                        Hi, I'm <span className="gradient-text">{data.hero.name}</span>
                    </h1>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 10px', lineHeight: 1.6 }}>
                        {data.hero.title}
                    </p>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.4 }}>
                        {data.hero.description}
                    </p>
                    <div className="hero-btns fade-in" ref={addToRefs}>
                        <a href="#projects" className="btn btn-primary btn-gradient">View My Work</a>
                        <a href="#contact" className="btn btn-secondary btn-outline">Get In Touch</a>
                    </div>
                </div>
            </div>
            <style>{`
                .hero-grid { display: block; }
                .badge { display: inline-block; padding: 10px 24px; background: var(--primary-glow); border: 1px solid var(--border-color); border-radius: 100px; color: var(--primary); font-size: 0.8125rem; font-weight: 600; margin-bottom: 24px; }
                .hero-btns { display: flex; gap: 16px; margin-top: 40px; justify-content: center; }
                .image-wrapper { position: relative; width: 140px; height: 140px; margin: 0 auto; }
                .image-wrapper img { 
                    width: 100%; height: 100%; object-fit: cover; 
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    border: 2px solid var(--border-color); 
                    padding: 2px;
                    opacity: 0.9;
                    mix-blend-mode: luminosity;
                    transition: 0.5s ease;
                }
                .image-wrapper img:hover {
                    opacity: 1;
                    mix-blend-mode: normal;
                    border-radius: 50%;
                }
                html.light-mode .image-wrapper img {
                    mix-blend-mode: normal;
                    border-color: var(--primary);
                    opacity: 1;
                }
                .btn-gradient { background: var(--gradient); color: white; border: none; padding: 14px 32px; font-size: 1rem; }
                .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 14px 32px; font-size: 1rem; }
                .btn-outline:hover { background: var(--primary-glow); border-color: var(--primary); }

                @media (max-width: 480px) {
                    .hero-btns { flex-direction: column; width: 100%; }
                    .hero-btns .btn { width: 100%; text-align: center; }
                    .image-wrapper { width: 100px; height: 100px; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
