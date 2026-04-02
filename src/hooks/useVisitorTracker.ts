import { useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient'; // No longer using Supabase for tracking

export const useVisitorTracker = () => {
    useEffect(() => {
        const trackVisit = async () => {
            const hasVisited = sessionStorage.getItem('portfolio_visited');

            if (!hasVisited) {
                try {
                    const response = await fetch('/api/analytics/track', {
                        method: 'POST'
                    });

                    if (response.ok) {
                        sessionStorage.setItem('portfolio_visited', 'true');
                    }
                } catch (err) {
                    console.error('Visitor tracking failed:', err);
                }
            }
        };

        trackVisit();
    }, []);
};
