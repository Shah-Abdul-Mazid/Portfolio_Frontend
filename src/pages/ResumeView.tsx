import Header from '../components/Header';
import Resume from '../components/Resume';
import Footer from '../components/Footer';

const ResumeView = () => {
    return (
        <div className="resume-view-page">
            <Header />
            <main style={{ paddingTop: '80px' }}>
                <Resume />
            </main>
            <Footer />
        </div>
    );
};

export default ResumeView;
