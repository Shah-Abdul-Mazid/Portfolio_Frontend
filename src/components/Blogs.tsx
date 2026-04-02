import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink } from 'lucide-react';

const Blogs = ({ addToRefs }: { addToRefs: (el: HTMLElement | null) => void }) => {
    const { data } = usePortfolio();
    const blogs = data.blogs || [];

    if (blogs.length === 0) return null;

    return (
        <section id="blogs" className="section bg-light">
            <div className="container">
                <div className="section-title fade-in" ref={addToRefs}>
                    <span className="subtitle">{data.sections?.blogs?.subtitle || 'Writing'}</span>
                    <h2>
                        {data.sections?.blogs?.title ? (
                            <span dangerouslySetInnerHTML={{ __html: data.sections.blogs.title.replace(/(\S+)$/, '<span class="gradient-text">$1</span>') }} />
                        ) : (
                            <>Recent <span className="gradient-text">Blog Posts</span></>
                        )}
                    </h2>
                </div>
                <div className="blogs-grid">
                    {blogs.map((item, index) => (
                        <div key={index} className="blog-card fade-in" ref={addToRefs}>
                            <div className="blog-content">
                                <span className="blog-date">{item.date}</span>
                                <h3 className="blog-title">{item.title}</h3>
                                <p className="blog-excerpt">{item.excerpt}</p>
                            </div>
                            <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} 
                               target="_blank" rel="noreferrer" className="blog-link-btn">
                                <span>Read Full Article</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .blogs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 40px; }
                .blog-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; transition: var(--transition); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
                .blog-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1); }
                .blog-content { padding: 32px; flex: 1; }
                .blog-date { display: inline-block; font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; background: rgba(139, 92, 246, 0.1); padding: 4px 10px; border-radius: 100px; }
                .blog-title { font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 16px; line-height: 1.3; }
                .blog-excerpt { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }
                .blog-link-btn { display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255, 255, 255, 0.03); border-top: 1px solid var(--border-color); color: var(--text-main); padding: 16px; font-weight: 600; text-decoration: none; transition: background 0.2s, color 0.2s; }
                .blog-card:hover .blog-link-btn { background: var(--primary); color: white; border-top-color: var(--primary); }
            `}</style>
        </section>
    );
};

export default Blogs;
