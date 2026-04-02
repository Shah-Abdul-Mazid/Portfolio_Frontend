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
    'work':         '/work',
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

    // ── Route change → scroll to matching section ─────────────────────────
    useEffect(() => {
        const raw = location.pathname.replace('/', '');
        const targetId = raw === '' ? 'hero' : raw;
        const el = document.getElementById(targetId);
        
        if (el) {
            // Lock out the observer for 1.5s while smooth scroll happens
            scrollLock.current = true;
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            const timer = setTimeout(() => {
                scrollLock.current = false;
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    // ── Scroll → update URL via IntersectionObserver ──────────────────────
    useEffect(() => {
        // Use a single observer for ALL sections to prevent race conditions
        const observer = new IntersectionObserver((entries) => {
            if (scrollLock.current) return;

            // Find the entry that has the highest intersection ratio
            // and is significantly visible (threshold 0.5+)
            let bestEntry: IntersectionObserverEntry | null = null;
            let maxRatio = 0.5; // Only care if at least 50% visible

            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    bestEntry = entry;
                }
            });

            if (bestEntry) {
                const id = (bestEntry.target as HTMLElement).id;
                const newPath = SECTION_ROUTES[id];
                if (newPath && window.location.pathname !== newPath) {
                    // Update URL without triggering a scroll (replace state)
                    navigate(newPath, { replace: true });
                }
            }
        }, { 
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: '-10% 0px -10% 0px' // Focus on the middle 80% of screen
        });

        Object.keys(SECTION_ROUTES).forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [navigate]);

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
