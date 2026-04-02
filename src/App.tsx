import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Portfolio from './pages/Portfolio';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { PortfolioProvider } from './context/PortfolioContext';
import { useVisitorTracker } from './hooks/useVisitorTracker';

const TrackerWrapper = ({ children }: { children: React.ReactNode }) => {
    useVisitorTracker();
    return <>{children}</>;
};

function App() {
    return (
        <PortfolioProvider>
            <BrowserRouter>
                <TrackerWrapper>
                    <Routes>
                        {/* Redirect root to admin login when launched as installed PWA */}
                        <Route path="/" element={
                            window.matchMedia('(display-mode: standalone)').matches
                                ? <Navigate to="/login/admin" replace />
                                : <Portfolio />
                        } />
                        <Route path="/about" element={<Portfolio />} />
                        <Route path="/education" element={<Portfolio />} />
                        <Route path="/work" element={<Portfolio />} />
                        <Route path="/achievements" element={<Portfolio />} />
                        <Route path="/activities" element={<Portfolio />} />
                        <Route path="/skills" element={<Portfolio />} />
                        <Route path="/projects" element={<Portfolio />} />
                        <Route path="/papers" element={<Portfolio />} />
                        <Route path="/blogs" element={<Portfolio />} />
                        <Route path="/references" element={<Portfolio />} />
                        <Route path="/contact" element={<Portfolio />} />
                        <Route path="/login/admin" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Analytics />
                </TrackerWrapper>
            </BrowserRouter>
        </PortfolioProvider>
    );
}

export default App;
