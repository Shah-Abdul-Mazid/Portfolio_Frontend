import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface SkillCategory {
    name: string;
    items: string[];
}

export interface EducationItem {
    degree: string;
    school: string;
    year: string;
    major: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    logoUrl?: string; // Newly added
}

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    desc: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    logoUrl?: string; // Newly added
}

export interface WorkItem {
    role: string;
    company: string;
    startDate: string; // ISO format (e.g., 2022-01-03)
    endDate?: string;  // ISO format, null/empty = "Ongoing"
    details: string[];
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
    appointmentLetterUrl?: string;
    experienceLetterUrl?: string;
    logoUrl?: string; // Newly added
}

export interface ProjectItem {
    title: string;
    desc: string;
    tags: string[];
    showcase: number;
    projectUrl?: string;
    certificateUrl?: string;
    githubUrl?: string;
    thumbnailUrl?: string; // Newly added
}

export interface PaperItem {
    title: string;
    authors: string;
    venue: string;
    year: string;
    keywords: string;
    doi: string;
    documentUrl?: string; // New: PDF/Document viewer link
    certificateUrl?: string; // New: Certificate/Image viewer link
}

export interface ActivityItem {
    role: string;
    organization: string;
    period: string;
    desc: string;
    certificateUrl?: string; // Newly added
    attachmentUrl?: string; // Newly added
}

export interface ReferenceItem {
    name: string;
    title: string;
    company: string;
    email: string;
    phone?: string;
    relation: string;
}

export interface BlogItem {
    title: string;
    date: string;
    excerpt: string;
    url: string;
}

export interface SectionConfig {
    navLabel: string;
    adminLabel: string;
    subtitle: string;
    title: string;
}

export interface PortfolioData {
    sections: {
        about: SectionConfig;
        education: SectionConfig;
        work: SectionConfig;
        experience: SectionConfig;
        skills: SectionConfig;
        projects: SectionConfig;
        papers: SectionConfig;
        activities: SectionConfig; // New section
        references: SectionConfig; // New section
        blogs: SectionConfig; // New section
        contact: SectionConfig;
    };
    hero: {
        name: string;
        title: string;
        roles?: string[]; // Newly added for rotating text
        description: string;
        avatarUrl?: string; // Newly added
    };
    about: {
        bio: string;
        age: string;
        projects: string;
    };
    skills: SkillCategory[];
    education: EducationItem[];
    experience: ExperienceItem[];
    work: WorkItem[];
    projects: ProjectItem[];
    papers: PaperItem[];
    activities: ActivityItem[]; // New
    references: ReferenceItem[]; // New
    blogs: BlogItem[]; // New
    contact: {
        email: string;
        phone: string;
        location: string;
        whatsapp: string;
        messenger: string;
        facebook: string;
        github?: string;
        linkedin?: string;
    };
}

const defaultData: PortfolioData = {
    sections: {
        about: { navLabel: 'About', adminLabel: 'Intro & Profile', subtitle: 'About Me', title: 'A Digital Craftsman with a Passion' },
        education: { navLabel: 'Education', adminLabel: 'Education', subtitle: 'Education', title: 'My Academic Journey' },
        work: { navLabel: 'Experience', adminLabel: 'Work History', subtitle: 'Career Journey', title: 'Professional Experience' },
        experience: { navLabel: 'Achievements', adminLabel: 'Achievements', subtitle: 'Achievements', title: 'Hackathons & Competitions' },
        skills: { navLabel: 'Skills', adminLabel: 'Tech Stack', subtitle: 'Technical Stack', title: 'Core Expertise' },
        projects: { navLabel: 'Projects', adminLabel: 'Portfolio', subtitle: 'Projects', title: 'Featured Projects' },
        papers: { navLabel: 'Research', adminLabel: 'Research Papers', subtitle: 'Publications', title: 'Research Papers' },
        activities: { navLabel: 'Activities', adminLabel: 'Extracurriculars', subtitle: 'Involvement', title: 'Extracurricular Activities' },
        references: { navLabel: 'References', adminLabel: 'References', subtitle: 'Recommendations', title: 'Professional References' },
        blogs: { navLabel: 'Blog', adminLabel: 'Blog Posts', subtitle: 'Writing', title: 'Recent Blog Posts' },
        contact: { navLabel: 'Contact', adminLabel: 'Contact Details', subtitle: 'Contact', title: 'Let\'s Start a Conversation' }
    },
    hero: {
        name: "Shah Abdul Mazid",
        title: "Data Scientist | AI Developer",
        roles: [
            "Data Scientist",
            "AI Developer",
            "ML Engineer",
            "Software Engineer"
        ],
        description: "Passionate Data Scientist and AI Developer dedicated to building scalable, intelligent solutions."
    },
    about: {
        bio: "Computer Science and Engineering student specializing in Intelligent Systems and Data Science at East West University, currently working as an AI Developer at Softvence Agency.\n\nExperienced in building real-world AI solutions, including automation systems, AI chatbots, and Retrieval-Augmented Generation pipelines. Skilled in deep learning, computer vision, NLP, and deploying scalable APIs using FastAPI.\n\nStrong background in developing end-to-end intelligent systems through research, industry work, and hackathons. Passionate about leveraging AI to solve complex real-world problems and contribute to innovative, high-impact projects.",
        age: "24",
        projects: "15+"
    },
    skills: [
        { name: 'Languages', items: ['Python', 'JavaScript', 'SQL'] },
        { name: 'Frameworks', items: ['FastAPI', 'Streamlit', 'React'] },
        { name: 'AI/ML', items: ['RAG', 'LLMs', 'LangChain', 'SentenceTransformers'] },
        { name: 'Tools', items: ['n8n', 'Docker', 'Git', 'Postman'] },
        { name: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Pinecone'] },
        { name: 'Cloud', items: ['Vercel', 'Supabase', 'Cloudflare R2'] }
    ],
    education: [
        { degree: 'B.Sc. in Computer Science & Engineering', school: 'East West University', year: '2021 – 2026', major: 'Major: Intelligent Systems & Data Science' },
        { degree: 'Higher Secondary Certificate (HSC)', school: 'Dhaka Ideal College', year: '2018 – 2020', major: 'Science' },
        { degree: 'Secondary School Certificate (SSC)', school: 'Badshah Faisal Institute', year: '2016 – 2018', major: 'Science' }
    ],
    experience: [
        { role: 'Network War', company: 'EWU Telecommunication Club', period: '2024', desc: 'Participated in the specialized networking competition.', certificateUrl: '/data/work-certificate.png' },
        { role: 'IT Olympiad', company: 'CSE FEST 2024', period: '2024', desc: 'Department of Computer Science & Engineering, East West University.' },
        { role: 'In House Programming Battle', company: 'EWUCoPC', period: '2022', desc: 'Certified participant in the campus-wide coding battle.' }
    ],
    work: [
        { 
            role: 'AI Engineer', 
            company: 'Softvence Agency', 
            startDate: '2026-02-01', 
            endDate: '', 
            details: [
                'Developing and deploying AI-driven solutions, including automation systems, AI chatbots, and RAG-based applications.',
                'Designing and implementing scalable backend architectures using FastAPI and modern AI frameworks.',
                'Working with LLMs, NLP pipelines, and vector databases to build intelligent, production-ready systems.',
                'Contributing to research-oriented projects and integrating cutting-edge AI technologies into real-world applications.'
            ]
        },
        { 
            role: 'Campus Ambassador', 
            company: 'eShikhon', 
            startDate: '2022-01-01', 
            endDate: '2025-12-30', 
            details: [
                'Represented organization as campus lead.',
                'Organized technical workshops and knowledge sessions.',
                'Collaborated with cross-functional teams for student outreach.'
            ],
            appointmentLetterUrl: '/data/eshikhon-appointment-letter.pdf'
        }
    ],
    projects: [
        { 
            title: 'HR Policies RAG Chatbot', 
            desc: 'An intelligent chatbot for HR policy information using RAG, LLMs, and FastAPI.', 
            tags: ['RAG', 'LLM', 'FastAPI', 'Streamlit', 'Pinecone', 'Llama2', 'NLP', 'SentenceTransformers'], 
            showcase: 1 
        },
        { 
            title: 'TrackMyBus', 
            desc: 'Real-time bus tracking application for university students.', 
            tags: ['Flutter', 'Firebase', 'Firestore', 'Geolocation', 'Google Maps API'], 
            showcase: 2 
        },
        { 
            title: 'WhatsUpIn', 
            desc: 'Comprehensive automation and AI agent solutions for business workflows.', 
            tags: ['n8n', 'OpenAI API', 'Automation', 'AI Agents'], 
            showcase: 3 
        },
        { 
            title: 'Hate Speech Detection from Live Stream', 
            desc: 'Real-time hate speech detection system for live audio streams using BERT and TensorFlow.', 
            tags: ['BERT', 'PyAudio', 'TensorFlow', 'Deep Learning'], 
            showcase: 4 
        },
        { 
            title: 'Mechanical Glove Mouse', 
            desc: 'Wireless glove mouse for human-computer interaction using ESP32-S3 and MPU6050.', 
            tags: ['ESP32-S3', 'MPU6050', 'Arduino', 'HCI'], 
            showcase: 5 
        }
    ],
    papers: [
        { 
            title: 'A Review on Papaya Leaf and Fruit Disease Classification Techniques', 
            authors: 'Rank, Yashkumar and Sutariya, Kruti', 
            venue: '3rd International Conference on Automation, Computing and Renewable Systems (ICACRS)', 
            year: '2024', 
            keywords: 'Precision agriculture;Papaya Disease;Machine Learning;Vision Transformers', 
            doi: '10.1109/ICACRS62842.2024.10841766' 
        },
        { 
            title: 'Real-Time Hate Speech Detection using Bidirectional Transformer Representations', 
            authors: 'Mazid, Shah Abdul and Rahaman, Md.', 
            venue: 'International Journal of advanced Computer Science and Applications', 
            year: '2023', 
            keywords: 'NLP;BERT;Audio Streams;TensorFlow;Hate Speech', 
            doi: '10.14569/IJACSA.2023.141201' 
        },
        { 
            title: 'VAID: A Novel High-Altitude Aerial Image Dataset for Vehicle Detection', 
            authors: 'Mazid, Shah Abdul', 
            venue: 'IEEE Transactions on Geoscience and Remote Sensing', 
            year: '2023', 
            keywords: 'Computer Vision;Aerial Imaging;Vehicle Detection;Dataset', 
            doi: '10.1109/TGRS.2023.1023948' 
        },
        { 
            title: 'Optimizing Mechanical Glove Mouse Control Systems via Motion Sensors', 
            authors: 'Mazid, Shah Abdul and Hasan, K.', 
            venue: 'Conference on Human-Computer Interaction', 
            year: '2022', 
            keywords: 'HCI;ESP32;MPU6050;Hardware Integration', 
            doi: '10.1145/3544548.3581234' 
        },
        { 
            title: 'Dynamic Customer Support Automation using Large Language Models', 
            authors: 'Mazid, Shah Abdul', 
            venue: 'Journal of Artificial Intelligence Research', 
            year: '2024', 
            keywords: 'LLMs;OpenAI;Pinecone;n8n;E-Commerce', 
            doi: '10.1613/jair.1.13221' 
        },
        { 
            title: 'A Framework for Competitive Intelligence Workflow Automation via Web Scraping', 
            authors: 'Mazid, Shah Abdul and Ahmed, S.', 
            venue: 'International Conference on Data Mining', 
            year: '2023', 
            keywords: 'Data Mining;Web Scraping;Jungle Scout;Automation', 
            doi: '10.1109/ICDM50133.2023.0039' 
        }
    ],
    activities: [
        { role: 'Event Organizer', organization: 'EWU Computer Club', period: '2022 - 2023', desc: 'Organized national programming contests and technical workshops for over 500 participants.' }
    ],
    references: [
        { name: 'Dr. Example Professor', title: 'Head of CSE Department', company: 'East West University', email: 'professor@ewubd.edu', relation: 'Academic Advisor' }
    ],
    blogs: [
        { title: 'The Future of AI in Web Development', date: 'October 2024', excerpt: 'Exploring how large language models are fundamentally changing how we approach UI engineering.', url: '#' }
    ],
    contact: {
        email: "shahabdulmazid.ezan@yahoo.com",
        phone: "(+88015) 3132-9222",
        location: "Dhaka, Bangladesh",
        whatsapp: "https://wa.me/8801531329222",
        messenger: "https://m.me/shahabdulmazid.ezan",
        facebook: "https://facebook.com/shahabdulmazid.ezan",
        github: "https://github.com/Shah-Abdul-Mazid",
        linkedin: "https://linkedin.com/in/shahabdulmazid"
    }
};

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: PortfolioData) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const API_BASE = '/api';

// Helper to resolve document URLs (Supports Local, GridFS, and Cloudinary)
export const resolveUrl = (url: string | undefined): string => {
    if (!url) return '';

    // 1. If it's already a full Cloudinary or generic HTTPS URL, return as is
    if (url.startsWith('https://') || (url.startsWith('http://') && !url.includes('localhost'))) {
        return url;
    }

    // 2. Handle localhost URLs from old data
    if (url.includes('localhost:3001/')) {
        const path = url.split('localhost:3001')[1];
        const isDev = window.location.hostname === 'localhost';
        return isDev ? `http://localhost:3001${path}` : path;
    }

    // 3. Handle relative paths (e.g., /uploads/ or /api/upload/)
    const isDev = window.location.hostname === 'localhost';
    const backendUrl = 'http://localhost:3001'; // Default dev backend
    
    if (url.startsWith('/') && isDev) {
        // In dev, prefix relative paths with the backend URL
        return `${backendUrl}${url}`;
    }

    // 4. In production, relative paths work fine if proxied or on same origin
    return url;
};


const sanitizeData = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string' && obj.startsWith('/data/')) {
            return obj.replace(/ /g, '-');
        }
        return obj;
    }
    if (Array.isArray(obj)) return obj.map(sanitizeData);
    const newObj: any = {};
    for (const key in obj) {
        newObj[key] = sanitizeData(obj[key]);
    }
    return newObj;
};

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PortfolioData>(defaultData);

    // Load portfolio data: try DB first, then localStorage, then defaultData
    useEffect(() => {
        const load = async () => {
            try {
                // Add timestamp to violently bypass strict Vercel Edge caching
                const res = await fetch(`${API_BASE}/portfolio?t=${new Date().getTime()}`, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                if (res.ok) {
                    const dbData = await res.json();
                    if (dbData) {
                        const merged = { 
                            ...defaultData, 
                            ...dbData, 
                            sections: { ...defaultData.sections, ...(dbData.sections || {}) },
                            contact: { ...defaultData.contact, ...(dbData.contact || {}) } 
                        };
                        const sanitized = sanitizeData(merged);
                        setData(sanitized);
                        localStorage.setItem('portfolio_data', JSON.stringify(sanitized));
                        return;
                    }
                }
            } catch {
                console.warn('Backend unreachable, loading from localStorage...');
            }
            // Fallback to localStorage cache
            const saved = localStorage.getItem('portfolio_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const merged = { 
                        ...defaultData, 
                        ...parsed, 
                        sections: { ...defaultData.sections, ...(parsed.sections || {}) },
                        contact: { ...defaultData.contact, ...(parsed.contact || {}) } 
                    };
                    setData(sanitizeData(merged));
                } catch {
                    setData(defaultData);
                }
            }
        };
        load();
    }, []);

    useEffect(() => {
        const syncTabs = (e: StorageEvent) => {
            if (e.key === 'portfolio_data' && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setData(parsed);
                } catch (err) {
                    console.error('Error syncing tab data:', err);
                }
            }
        };
        window.addEventListener('storage', syncTabs);
        return () => window.removeEventListener('storage', syncTabs);
    }, []);

    const updateData = async (newData: PortfolioData): Promise<boolean> => {
        const sanitized = sanitizeData(newData);
        setData(sanitized);
        
        // Always save to localStorage as instant cache (triggers 'storage' event in other tabs)
        localStorage.setItem('portfolio_data', JSON.stringify(sanitized));
        
        // Save to backend DB for cross-device sync
        try {
            console.log('📡 Syncing portfolio to MongoDB Atlas...');
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_BASE}/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(sanitized)
            });
            
            if (res.ok) {
                console.log('✅ Portfolio data saved to MongoDB');
                return true;
            } else {
                const errText = await res.text();
                console.warn('❌ Failed to save portfolio to DB:', errText);
                return false;
            }
        } catch (err) {
            console.warn('⚠️ Could not reach backend to save portfolio data:', err);
            return false;
        }
    };



    return (
        <PortfolioContext.Provider value={{ data, updateData }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within a PortfolioProvider");
    }
    return context;
};
