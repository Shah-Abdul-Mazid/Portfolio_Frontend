import Header from '../components/Header';
import Footer from '../components/Footer';
import Resume from '../components/Resume';

const ResumeView = () => {
    return (
        <div className="resume-view-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
            <Header />
            <main style={{ paddingTop: '100px', flex: 1, paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                    <Resume />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ResumeView;
