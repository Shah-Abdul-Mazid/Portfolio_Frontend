import { useState, useEffect } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import avtarImg from '../assets/avtar.png';


const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const [roleIndex, setRoleIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const roles = data.hero.roles && data.hero.roles.length > 0 ? data.hero.roles : [data.hero.title];

    useEffect(() => {
        if (roles.length <= 1) return;
        
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setRoleIndex((prev) => (prev + 1) % roles.length);
                setFade(true);
            }, 500); // fade duration matches CSS transition
        }, 3000); // 3 seconds per role

        return () => clearInterval(interval);
    }, [roles.length]);
    
    return (
        <section id="hero" className="hero section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '120px' }}>
            <div className="container">
                <div className="hero-image fade-in" ref={addToRefs} style={{ marginBottom: '32px' }}>
                    <div className="image-wrapper">
                        <img src={data.hero.avatarUrl ? resolveUrl(data.hero.avatarUrl) : avtarImg} alt={data.hero.name} />
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="badge fade-in" ref={addToRefs}>Available for new opportunities</div>
                    <h1 className="fade-in" ref={addToRefs} style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, margin: '16px 0' }}>
                        Hi, I'm <span className="gradient-text">{data.hero.name}</span>
                    </h1>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 10px', lineHeight: 1.6, minHeight: '38px', display: 'flex', justifyContent: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {(() => {
                                const text = roles[roleIndex] || '';
                                const middle = Math.ceil(text.length / 2);
                                const leftPart = text.slice(0, middle);
                                const rightPart = text.slice(middle);
                                return (
                                    <>
                                        <span className={`split-half left-half ${fade ? 'in' : 'out'}`} style={{ whiteSpace: 'pre' }}>{leftPart}</span>
                                        <span className={`split-half right-half ${fade ? 'in' : 'out'}`} style={{ whiteSpace: 'pre' }}>{rightPart}</span>
                                    </>
                                );
                            })()}
                        </span>
                    </p>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.4 }}>
                        {data.hero.description}
                    </p>
                    <div className="hero-btns fade-in" ref={addToRefs}>
                        <Link to="/projects" className="btn btn-primary btn-gradient">View My Work</Link>
                        <Link to="/contact" className="btn btn-secondary btn-outline">Get In Touch</Link>
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
                
                .split-half {
                    display: inline-block;
                    opacity: 0;
                }
                
                .left-half.in {
                    animation: splitLeftIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .right-half.in {
                    animation: splitRightIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                
                .left-half.out {
                    animation: splitLeftOut 0.4s cubic-bezier(0.8, 0.2, 1, 0.8) forwards;
                }
                .right-half.out {
                    animation: splitRightOut 0.4s cubic-bezier(0.8, 0.2, 1, 0.8) forwards;
                }

                @keyframes splitLeftIn {
                    0% { opacity: 0; transform: translateX(-40px); filter: blur(4px); }
                    100% { opacity: 1; transform: translateX(0); filter: blur(0px); }
                }
                @keyframes splitRightIn {
                    0% { opacity: 0; transform: translateX(40px); filter: blur(4px); }
                    100% { opacity: 1; transform: translateX(0); filter: blur(0px); }
                }
                @keyframes splitLeftOut {
                    0% { opacity: 1; transform: translateX(0); filter: blur(0px); }
                    100% { opacity: 0; transform: translateX(-40px); filter: blur(4px); }
                }
                @keyframes splitRightOut {
                    0% { opacity: 1; transform: translateX(0); filter: blur(0px); }
                    100% { opacity: 0; transform: translateX(40px); filter: blur(4px); }
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
