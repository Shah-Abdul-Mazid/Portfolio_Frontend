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
import Certifications from '../components/Certifications';
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
    'certifications': '/certifications',
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

    // ── Pre-mount: Disable browser scroll restoration immediately ─────────
    // This must run as early as possible — before any effects — to prevent
    // the browser from jumping to the previously saved scroll position on refresh.
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    // ── On page refresh/first load: ALWAYS go back to top (hero section) ────
    // This runs once on mount. If the user refreshes while on /achievements,
    // we redirect them to '/' so the page always starts from the top.
    useEffect(() => {
        // Immediately snap to top to override any browser scroll restoration
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // If the URL is not root on first load, redirect to root
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
        }

        // Release the first-load guard after layout has settled
        const timer = setTimeout(() => {
            isFirstLoad.current = false;
        }, 1500);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ← empty deps = runs ONCE on mount only

    // ── Route change → scroll to matching section ─────────────────────────
    // (Only runs AFTER first load, when the user clicks a nav link)
    useEffect(() => {
        // Skip during first load — the mount effect above handles it
        if (isFirstLoad.current) return;

        const raw = location.pathname.replace('/', '');
        const targetId = raw === '' ? 'hero' : raw;
        const el = document.getElementById(targetId);

        if (el) {
            scrollLock.current = true;
            el.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                scrollLock.current = false;
            }, 1200);
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
                <Certifications addToRefs={addToRefs} />
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
