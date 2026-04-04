import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Papers from '../components/Papers';
import WorkExperience from '../components/WorkExperience';
import Activities from '../components/Activities';
import References from '../components/References';
import Blogs from '../components/Blogs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingContactForm from '../components/FloatingContactForm';
import IntelligenceMatrix from '../components/IntelligenceMatrix';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

// Maps section IDs → URL paths
const SECTION_ROUTES: Record<string, string> = {
    'hero':         '/',
    'about':        '/about',
    'education':    '/education',
    'experience':   '/experience',
    'achievements': '/achievements',

    'activities':   '/activities',
    'skills':       '/skills',
    'projects':     '/projects',
    'papers':       '/papers',
    'blogs':        '/blogs',
    'references':   '/references',
    'contact':      '/contact',
};

const Portfolio = () => {
    const { addToRefs } = useIntersectionObserver();
    const location = useLocation();
    const navigate = useNavigate();
    const scrollLock = useRef(false);
    const isFirstLoad = useRef(true); // Prevent observer navigation during initial load


    // ── Pre-mount: Manual Scroll Restoration ──────────────────────────────
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // ── Route change → scroll to matching section ─────────────────────────
    useEffect(() => {
        const raw = location.pathname.replace('/', '');
        const targetId = raw === '' ? 'hero' : raw;
        const el = document.getElementById(targetId);
        
        if (el) {
            scrollLock.current = true;
            
            // If hitting home for the first time, force a hard scroll to top to avoid browser jumps
            if (targetId === 'hero' && isFirstLoad.current) {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }
            
            el.scrollIntoView({ behavior: 'smooth' });
            
            // Wait longer for smooth scroll to finish and layout to stabilize
            setTimeout(() => { 
                scrollLock.current = false;
                isFirstLoad.current = false; 
            }, 3000); 
        }
    }, [location.pathname]);



    // ── Scroll → update URL via IntersectionObserver ──────────────────────
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        Object.keys(SECTION_ROUTES).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !scrollLock.current && !isFirstLoad.current) {
                        const newPath = SECTION_ROUTES[id];
                        if (window.location.pathname !== newPath) {
                            navigate(newPath, { replace: true });
                        }
                    }
                },
                { threshold: 0.45 }
            );

            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    return (
        <div className="app">
            <IntelligenceMatrix />
            <Header />
            <main>
                <Hero addToRefs={addToRefs} />
                <About addToRefs={addToRefs} />
                <Education addToRefs={addToRefs} />
                <WorkExperience addToRefs={addToRefs} />
                <Experience addToRefs={addToRefs} />
                <Activities addToRefs={addToRefs} />
                <Skills addToRefs={addToRefs} />
                <Projects addToRefs={addToRefs} />
                <Papers addToRefs={addToRefs} />
                <Blogs addToRefs={addToRefs} />
                <References addToRefs={addToRefs} />
                <Contact addToRefs={addToRefs} />
            </main>
            <Footer />
            <FloatingContactForm />
        </div>
    );
};

export default Portfolio;
