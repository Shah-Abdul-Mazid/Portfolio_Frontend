import { useState, useEffect } from 'react';
import { usePortfolio, resolveUrl } from '../context/PortfolioContext';
import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import avtarImg from '../assets/avtar.png';


const Hero = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const [roleIndex, setRoleIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const roles = data.hero.roles && data.hero.roles.length > 0 ? data.hero.roles : [data.hero.title];
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'short', 
            month: 'short', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };
        return date.toLocaleString('en-US', options).replace(/,/g, '');
    };

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
                    <div className="time-pill-container fade-in" ref={addToRefs}>
                        <div className="time-pill">
                            <span className="time-text">{formatTime(currentTime)}</span>
                            <div className="pill-divider"></div>
                            <div className="theme-toggle-mini">
                                <Moon size={14} className="moon-icon" />
                                <div className="toggle-slider">
                                    <div className="slider-thumb">
                                        <div className="thumb-dots"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="badge fade-in" ref={addToRefs}>Available for new opportunities</div>
                    <h1 className="fade-in" ref={addToRefs} style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 900, margin: '16px 0' }}>
                        Hi, I'm <span className="gradient-text">{data.hero.name}</span>
                    </h1>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 10px', lineHeight: 1.6, minHeight: '38px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {(() => {
                                const text = roles[roleIndex] || '';
                                return text.split('').map((char, index) => {
                                    const len = text.length;
                                    const center = (len - 1) / 2;
                                    const dist = Math.abs(index - center);
                                    const maxDist = center;
                                    
                                    // Fading IN: center appears first, expands outwards
                                    const inDelay = dist * 0.04;
                                    // Fading OUT: edges vanish first, ends at the middle
                                    const outDelay = (maxDist - dist) * 0.04;
                                    const delay = fade ? inDelay : outDelay;

                                    return (
                                        <span 
                                            key={`${roleIndex}-${index}`}
                                            className={`edge-fade ${fade ? 'in' : 'out'}`}
                                            style={{ 
                                                animationDelay: `${delay}s`,
                                                whiteSpace: 'pre'
                                            }}
                                        >
                                            {char === ' ' ? ' ' : char}
                                        </span>
                                    );
                                });
                            })()}
                        </span>
                    </p>
                    <p className="fade-in" ref={addToRefs} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.4 }}>
                        {data.hero.description}
                    </p>
                    <div className="hero-btns fade-in" ref={addToRefs}>
                        <Link to="/projects" className="btn btn-primary btn-gradient">View My Work</Link>
                        <Link to="/resume" className="btn btn-secondary btn-outline">My Resume</Link>
                        <Link to="/contact" className="btn btn-secondary btn-outline">Get In Touch</Link>
                    </div>

                </div>
            </div>
            <style>{`
                .hero-grid { display: block; }
                .time-pill-container { display: flex; justify-content: center; margin-bottom: 24px; }
                .time-pill { 
                    display: flex; 
                    align-items: center; 
                    gap: 12px; 
                    background: rgba(13, 13, 18, 0.6); 
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 6px 6px 6px 20px;
                    border-radius: 100px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .time-text { 
                    font-family: 'JetBrains Mono', 'Fira Code', monospace; 
                    font-size: 0.85rem; 
                    color: rgba(255, 255, 255, 0.9);
                    letter-spacing: 0.5px;
                }
                .pill-divider { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.1); }
                
                .theme-toggle-mini {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-right: 4px;
                }
                .moon-icon { color: rgba(255, 255, 255, 0.6); }
                .toggle-slider {
                    width: 32px;
                    height: 18px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    position: relative;
                }
                .slider-thumb {
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    width: 14px;
                    height: 14px;
                    background: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .thumb-dots {
                    width: 6px;
                    height: 6px;
                    background: #ccc;
                    border-radius: 50%;
                }



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
                
                .edge-fade {
                    display: inline-block;
                    opacity: 0;
                }
                
                .edge-fade.in {
                    animation: edgeFadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .edge-fade.out {
                    animation: edgeFadeOut 0.6s cubic-bezier(0.8, 0.2, 1, 0.8) forwards;
                }

                @keyframes edgeFadeIn {
                    0% { opacity: 0; filter: blur(6px); transform: scale(0.95); letter-spacing: -2px; }
                    100% { opacity: 1; filter: blur(0px); transform: scale(1); letter-spacing: 0px; }
                }

                @keyframes edgeFadeOut {
                    0% { opacity: 1; filter: blur(0px); transform: scale(1); letter-spacing: 0px; }
                    100% { opacity: 0; filter: blur(10px); transform: scale(0.9); letter-spacing: 2px; }
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
