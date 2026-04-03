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
    attachmentUrl?: string; // Newly added
    attachmentLabel?: string; // Newly added
    certificateUrl?: string; // Add certificate support for consistency if desired
}

export interface ExperienceItem {
    role: string;
    company: string;
    period: string;
    desc: string;
    attachmentUrl?: string;
    attachmentLabel?: string;
    certificateUrl?: string;
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
}

export interface ProjectItem {
    title: string;
    desc: string;
    tags: string[];
    showcase: number;
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
        description: string;
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
        title: "Machine Learning Researcher & Software Engineer",
        description: "A CSE student focused on Intelligent Systems & Data Science."
    },
    about: {
        bio: "I am a Computer Science and Engineering student majoring in Intelligent Systems and Data Science at East West University.\n\nPassionate about AI innovation, research, and hackathon projects. Skilled in deep learning, computer vision, NLP, and ML deployment with strong analytical and research abilities.\n\nMy journey in AI and Data Science revolves around developing intelligent systems that solve real-world problems. With a strong foundation in Computer Science, I aim to contribute to research, innovation, and impactful projects.",
        age: "24",
        projects: "10+"
    },
    skills: [
        { name: 'Programming Languages', items: ['Python', 'Java', 'C/C++', 'SQL', 'JavaScript'] },
        { name: 'AI/ML & Data Science', items: ['Deep Learning', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch'] },
        { name: 'Development', items: ['FastAPI', 'Flask', 'Java Swing', 'Streamlit', 'Docker', 'Vercel'] },
        { name: 'Tools', items: ['Git', 'Research', 'Academic Writing', 'Latex'] }
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
            role: 'Campus Ambassador', 
            company: 'eshikhon', 
            startDate: '2022-01-03', 
            endDate: '2025-12-30', 
            details: ['Represented the organization on campus.', 'Organized tech workshops and events.', 'Promoted digital learning among students.'],
            appointmentLetterUrl: '/data/eshikhon-appointment-letter.pdf'
        },
        { 
            role: 'Software Engineer', 
            company: 'softvence Omega', 
            startDate: '2026-02-01', 
            endDate: '', 
            details: ['Developing innovative AI solutions.', 'Implementing premium web architectures.', 'Contributing to research projects.']
        }
    ],
    projects: [
        { title: 'AI-Powered E-Commerce Customer Support Chatbot', desc: 'This project implements an AI-powered customer support chatbot for an e-commerce store using n8n, OpenAI, Pinecone, and Shopify.', tags: ['n8n', 'OpenAI', 'Pinecone', 'Shopify'], showcase: 1 },
        { title: 'Competitive Intelligence Workflow Automation', desc: 'Automated competitive intelligence workflow using n8n, Jungle Scout, and web scraping techniques.', tags: ['n8n', 'Jungle Scout', 'Scraping'], showcase: 2 },
        { title: 'VAID: Aerial Image Dataset', desc: 'An Aerial Image Dataset for Vehicle Detection research project targeting high-altitude surveillance.', tags: ['Aerial Imaging', 'Detection', 'Dataset'], showcase: 3 },
        { title: 'Library Management System', desc: 'A robust database project implemented with full CRUD operations and secure user authentication.', tags: ['SQL', 'Database'], showcase: 4 },
        { title: 'Hate Speech Detection from Live Stream', desc: 'This project implements a real-time hate speech detection system for live audio streams using BERT, PyAudio, and TensorFlow.', tags: ['BERT', 'PyAudio', 'TensorFlow'], showcase: 5 },
        { title: 'Mechanical Glove Mouse: Motion-Based Control', desc: 'Motion-controlled wireless glove mouse for human-computer interaction using ESP32-S3 and MPU6050 sensor.', tags: ['ESP32-S3', 'MPU6050', 'Arduino IDE'], showcase: 6 }
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
        phone: "+880 1531-329222",
        location: "Mohammadpur, Dhaka-1207",
        whatsapp: "https://wa.me/8801531329222",
        messenger: "https://m.me/shahabdulmazid.ezan",
        facebook: "https://facebook.com/shahabdulmazid.ezan"
    }
};

interface PortfolioContextType {
    data: PortfolioData;
    updateData: (newData: PortfolioData) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const API_BASE = '/api';

// Helper to resolve document URLs (strips localhost if present, ensuring it works in prod)
export const resolveUrl = (url: string | undefined): string => {
    if (!url) return '';
    // If it's already a full production URL or a relative path, keep it
    if (url.startsWith('https://') || url.startsWith('http://') && !url.includes('localhost')) {
        return url;
    }
    // If it's a localhost URL, convert to relative /uploads
    if (url.includes('localhost:3001/uploads/')) {
        return url.split('localhost:3001')[1];
    }
    // For relative paths like /uploads/..., prefix with backend URL in development
    // In production (Vercel), since it's proxied/served from same origin, /uploads/... works
    const isDev = window.location.hostname === 'localhost';
    if (url.startsWith('/uploads/') && isDev) {
        return `http://localhost:3001${url}`;
    }
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
                const res = await fetch(`${API_BASE}/portfolio`);
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

    const updateData = async (newData: PortfolioData) => {
        setData(newData);
        // Always save to localStorage as instant cache
        localStorage.setItem('portfolio_data', JSON.stringify(newData));
        // Save to backend DB for cross-device sync
        try {
            const token = localStorage.getItem('admin_token');
            const res = await fetch(`${API_BASE}/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(newData)
            });
            if (!res.ok) console.warn('Failed to save portfolio to DB:', await res.text());
            else console.log('✅ Portfolio synced to MongoDB');
        } catch (err) {
            console.warn('Could not reach backend to save portfolio data:', err);
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
