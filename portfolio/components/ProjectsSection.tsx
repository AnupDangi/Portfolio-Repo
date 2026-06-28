"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import React, { useRef } from "react";
import { Github, Youtube, ExternalLink, Linkedin } from "lucide-react";

// Individual Project Card component to handle 3D tilt physics per card
function ProjectCard({ proj, idx }: { proj: any, idx: number }) {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Transform mouse position to rotation ranges (-10deg to 10deg)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        // Reset rotations
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full perspective-[1000px] z-10"
        >
            <div
                className="bg-surface border border-surface-border rounded-2xl p-6 shadow-2xl backdrop-blur-sm h-full flex flex-col group relative overflow-hidden"
                style={{ transform: "translateZ(30px)" }} // Pop out content slightly 
            >
                {/* Hover Highlight Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon transition-colors relative z-10">
                    {proj.title}
                </h3>

                <p className="text-text-muted text-sm mb-4 relative z-10 leading-relaxed">
                    {proj.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 mb-6 relative z-10 mt-auto">
                    {proj.tech.map((t: string) => (
                        <span key={t} className="text-xs px-2 py-1 bg-surface border border-surface-border rounded text-text-muted shadow-sm">
                            {t}
                        </span>
                    ))}
                </div>

                {/* Links Container */}
                <div className="flex items-center gap-4 relative z-10">
                    {proj.live && (
                        <a href={proj.live} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-neon hover:text-foreground transition-colors" title="Live Project">
                            <ExternalLink className="w-5 h-5 mr-1.5" />
                            Live
                        </a>
                    )}
                    {proj.github && (
                        <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-text-muted hover:text-foreground transition-colors" title="View Source">
                            <Github className="w-5 h-5 mr-1.5" />
                            {proj.githubText || "Code"}
                        </a>
                    )}
                    {proj.youtube && (
                        <a href={proj.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors" title="Watch Demo">
                            <Youtube className="w-5 h-5 mr-1.5" />
                            Demo
                        </a>
                    )}
                    {proj.linkedin && (
                        <a href={proj.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors" title="View on LinkedIn">
                            <Linkedin className="w-5 h-5 mr-1.5" />
                            Post
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectsSection() {
    const clientProjects = [
        {
            title: "PRIMEFACE Engineering",
            live: "https://theprimeface.com",
            tech: ["Next.js", "Payment", "eSewa", "Email Automation"],
            description: "Professional Vastu-integrated consultancy platform featuring eSewa payment integration for service bookings and automated transactional email delivery.",
        },
        {
            title: "Portfolio: Er. Bikram Babu KC",
            live: "https://bikrambabu.com.np",
            tech: ["Next.js", "Portfolio", "Personal Branding"],
            description: "Professional personal brand portfolio for a civil engineer and Vastu consultant highlighting experience, academic achievements, and project history.",
        },
        {
            title: "Neelopatra",
            live: "https://neelopatra.com",
            tech: ["Next.js", "NLP", "AI Summarization", "Fact-Checking", "Chatbot"],
            description: "AI-driven news platform built with modern web technologies — featuring NLP-based summarization, chatbot-powered information retrieval, and an AI-assisted fact-checking pipeline for real-time misinformation detection.",
        },
        {
            title: "Purnima Suppliers",
            live: "https://www.purnimasuppliers.com",
            tech: ["Next.js", "E-Commerce", "Product Listings", "Offers"],
            description: "E-commerce platform for Purnima Suppliers — a trusted brand with 15+ years of customer loyalty. Showcasing products, deals, and offers online to expand visibility and strengthen customer engagement in the digital space.",
        },
    ];
    const workingOn = [
        {
            title: "Anvaya — A Collaborative Platform for Students & Researchers",
            live: "https://anvaya.space",
            tech: ["Next.js", "RAG", "Mem0", "AI LLMs", "PDF Highlights", "tldraw Canvas"],
            description: "An AI-first collaborative workspace built for students and researchers. Merge interactive PDF reading with an infinite canvas — highlight documents, get instant AI explanations, and visually map ideas together, all in one place.",
        },
    ];

    const personalProjects = [
        {
            title: "AICOLEARN (Paused AI Product)",
            youtube: "https://youtu.be/gs5YvjoeXEA",
            github: "#", // User mentioned "codebase private. github", we can put a disabled link or private tag.
            githubText: "Private Codebase",
            tech: ["AI", "WebRTC", "Collaboration", "RAG"],
            description: "AI-powered collaborative learning platform featuring real-time WebRTC audio/video, whiteboarding (tldraw), synchronous code collaboration (yjs), and multi-modal AI tools.",
        },
        {
            title: "VyaparAI",
            youtube: "https://youtu.be/gs5YvjoeXEA",
            github: "https://github.com/AnupDangi/VyaparAI",
            linkedin: "https://www.linkedin.com/posts/anup-dangi_nepcoders-openaiacademy-nxtwave-activity-7403513536783507456-XQa1?utm_source=share&utm_medium=member_desktop&rcm=ACoAADwAhfoBl-jNivygo9ZxIWXeNMbqc1WyFZc",
            tech: ["AI", "E-Commerce", "NL2SQL", "EasyOCR"],
            description: "Next-gen e-commerce solution powered by NLP. Features a conversational 'Talk to Your Data' interface for admins and a smart shopping assistant for customers. Upload a handwritten shopping list — VyaparAI extracts items and matches them from your inventory.",
        },
        {
            title: "SAI: Smart AI Interviewer",
            live: "https://smart-ai-interviewer-sai.vercel.app/",
            github: "https://github.com/AnupDangi/SmartAIInterviewer-SAI-.git",
            tech: ["AI", "Next.js"],
            description: "An intelligent platform for conducting and analyzing AI-driven mock interviews.",
        },
        {
            title: "A Trading Platform: Zerodha Clone",
            live: "https://zerodha-clone-ykwn.vercel.app/",
            github: "https://github.com/AnupDangi/ZerodhaClone",
            tech: ["React", "Fullstack"],
            description: "A comprehensive trading platform clone featuring real-time market data capabilities.",
        },
        {
            title: "Student Safety Tracker",
            github: "https://github.com/AnupDangi/StudentSafetyTracking_5thSem.git",
            tech: ["Tracking", "Safety", "CV"],
            description: "A platform where international students provide attendance through live face detection and location tracking.",
        },
        {
            title: "Multi-Modal RAG using local LLM",
            github: "https://github.com/AnupDangi/SIH25231-Multi-Modal-RAG",
            tech: ["RAG", "LLM", "Python", "Local"],
            description: "Multimodal RAG utilizing local Ollama models and CLIP for images to regenerate indexed chunks with citations.",
        }
    ];

    return (
        <SectionWrapper id="projects" title="Projects">

            {/* Client Projects Section */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex items-center gap-3 mb-6"
            >
                <span className="w-[3px] h-5 rounded-full bg-neon shrink-0" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
                    Client Projects
                </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {clientProjects.map((proj, idx) => (
                    <ProjectCard key={idx} proj={proj} idx={idx} />
                ))}
            </div>

            {/* Currently Working On Section */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex items-center gap-3 mb-6"
            >
                <span className="w-[3px] h-5 rounded-full bg-neon shrink-0" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
                    🚀 Currently Working On
                </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {workingOn.map((proj, idx) => (
                    <ProjectCard key={idx} proj={proj} idx={idx} />
                ))}
            </div>

            {/* Personal Projects Section */}
            <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="flex items-center gap-3 mb-6 pt-4"
            >
                <span className="w-[3px] h-5 rounded-full bg-neon shrink-0" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-text-muted">
                    Personal Projects
                </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {personalProjects.map((proj, idx) => (
                    <ProjectCard key={idx} proj={proj} idx={idx} />
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center text-text-muted mt-16 text-sm"
            >
                Worked on many other projects, check my <a href="https://github.com/AnupDangi" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline font-semibold">GitHub</a> for more details.
            </motion.p>
        </SectionWrapper>
    );
}
