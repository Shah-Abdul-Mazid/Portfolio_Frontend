import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avtarImg from '../assets/avtar.png';

const Header = () => {
    const professionalLinks = [
        { to: '/about', label: 'Profile' },
        { to: '/education', label: 'Education' },
        { to: '/work', label: 'Experience' },
        { to: '/achievements', label: 'Achievements' },
        { to: '/activities', label: 'Activities' },
    ];

    const portfolioLinks = [
        { to: '/skills', label: 'Tech Stack' },
        { to: '/projects', label: 'Projects' },
        { to: '/papers', label: 'Research' },
        { to: '/blogs', label: 'Blog' },
    ];

    const contactLinks = [
        { to: '/references', label: 'References' },
        { to: '/contact', label: 'Contact' },
    ];

    const allLinks = [...professionalLinks, ...portfolioLinks, ...contactLinks];

    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply theme on mount and when it changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className={scrolled ? 'scrolled' : ''} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: scrolled ? '12px 0' : '20px 0',
                transition: 'var(--transition)',
                backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
            }}>
                <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>
                    {/* Logo */}
                    <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', inset: '-2px', borderRadius: '50%',
                                background: 'var(--gradient)', zIndex: 0
                            }} />
                            <img src={avtarImg} alt="Logo" style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                objectFit: 'cover', position: 'relative', zIndex: 1,
                                border: '2px solid var(--bg-color)'
                            }} />
                        </div>
                        <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-color)', whiteSpace: 'nowrap' }}>Shah Abdul Mazid</span>
                    </Link>

                    {/* Desktop Nav - Flat side by side */}
                    <div className="nav-links-desktop">
                        {allLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={location.pathname === link.to ? 'nav-flat-link active' : 'nav-flat-link'}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} aria-label="Toggle theme" id="theme-toggle">
                            {isDarkMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                            )}
                        </button>

                        {/* Hamburger - mobile only */}
                        <button
                            className={`mobile-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            id="hamburger-btn"
                        >
                            <span className="bar" />
                            <span className="bar" />
                            <span className="bar" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Backdrop */}
            <div
                className={`mobile-backdrop ${isMenuOpen ? 'open' : ''}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Mobile Drawer */}
            <aside className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
                <div className="mobile-drawer-header">
                    <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={closeMenu}>
                        <img src={avtarImg} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-color)' }}>Shah Abdul Mazid</span>
                    </Link>
                    <button className="drawer-close" onClick={closeMenu} aria-label="Close menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                <nav className="mobile-nav">
                    <ul>
                        {allLinks.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={location.pathname === link.to ? 'mobile-nav-link active' : 'mobile-nav-link'}
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <style>{`
                #theme-toggle {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    cursor: pointer;
                    width: 40px; height: 40px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    transition: var(--transition);
                    flex-shrink: 0;
                }
                #theme-toggle:hover { border-color: var(--primary); color: var(--primary); }

                /* Flat Desktop nav */
                .nav-links-desktop {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    margin: 0 auto;
                    flex-wrap: nowrap;
                }
                .nav-flat-link {
                    text-decoration: none;
                    color: var(--text-color);
                    font-size: 0.85rem;
                    font-weight: 500;
                    padding: 8px 12px;
                    border-radius: 10px;
                    opacity: 0.7;
                    white-space: nowrap;
                    transition: var(--transition);
                    position: relative;
                }
                .nav-flat-link::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 12px;
                    right: 12px;
                    height: 2px;
                    background: var(--primary);
                    border-radius: 2px;
                    transform: scaleX(0);
                    transition: transform 0.25s ease;
                }
                .nav-flat-link:hover { opacity: 1; color: var(--primary); background: rgba(139,92,246,0.08); }
                .nav-flat-link:hover::after { transform: scaleX(1); }
                .nav-flat-link.active { opacity: 1; color: var(--primary); font-weight: 700; }
                .nav-flat-link.active::after { transform: scaleX(1); }

                /* Hamburger */
                .mobile-toggle {
                    display: none;
                    width: 40px; height: 40px;
                    background: transparent;
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    cursor: pointer;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 5px;
                    flex-shrink: 0;
                    transition: var(--transition);
                }
                .mobile-toggle:hover { border-color: var(--primary); }
                .mobile-toggle .bar {
                    width: 20px; height: 2px;
                    background: var(--text-color);
                    border-radius: 2px;
                    transition: var(--transition);
                    transform-origin: center;
                }
                .mobile-toggle.active .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
                .mobile-toggle.active .bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .mobile-toggle.active .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

                /* Backdrop */
                .mobile-backdrop {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 1100;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                    backdrop-filter: blur(2px);
                }
                .mobile-backdrop.open { opacity: 1; visibility: visible; }

                /* Drawer */
                .mobile-drawer {
                    position: fixed;
                    top: 0; right: -100%;
                    width: min(320px, 88vw);
                    height: 100dvh;
                    background: var(--bg-color);
                    border-left: 1px solid var(--border-color);
                    z-index: 1200;
                    display: flex;
                    flex-direction: column;
                    transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: -20px 0 60px rgba(0,0,0,0.25);
                    overflow-y: auto;
                }
                .mobile-drawer.open { right: 0; }

                .mobile-drawer-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-color);
                    flex-shrink: 0;
                }
                .drawer-close {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--text-color);
                    transition: var(--transition);
                }
                .drawer-close:hover { border-color: var(--primary); color: var(--primary); }

                .mobile-nav { flex: 1; padding: 16px 16px; }
                .mobile-nav ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
                .mobile-nav-link {
                    display: block;
                    padding: 14px 16px;
                    text-decoration: none;
                    color: var(--text-color);
                    font-size: 1rem;
                    font-weight: 500;
                    border-radius: 12px;
                    opacity: 0.7;
                    transition: var(--transition);
                }
                .mobile-nav-link:hover { opacity: 1; background: rgba(139,92,246,0.08); color: var(--primary); }
                .mobile-nav-link.active { opacity: 1; background: rgba(139,92,246,0.12); color: var(--primary); font-weight: 700; }

                @media (max-width: 900px) {
                    .nav-links-desktop { display: none; }
                    .mobile-toggle { display: flex; }
                    .mobile-backdrop { display: block; }
                }

                @media (max-width: 480px) {
                    .logo-link span { display: none; }
                }
            `}</style>
        </>
    );
};

export default Header;
