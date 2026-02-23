"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import React, { useRef } from "react";
import { Github, Youtube, ExternalLink } from "lucide-react";

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
                className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm h-full flex flex-col group relative overflow-hidden"
                style={{ transform: "translateZ(30px)" }} // Pop out content slightly 
            >
                {/* Hover Highlight Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon transition-colors relative z-10">
                    {proj.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 relative z-10 leading-relaxed">
                    {proj.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 mb-6 relative z-10 mt-auto">
                    {proj.tech.map((t: string) => (
                        <span key={t} className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300 shadow-sm border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>

                {/* Links Container */}
                <div className="flex items-center gap-4 relative z-10">
                    {proj.live && (
                        <a href={proj.live} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-neon hover:text-white transition-colors" title="Live Project">
                            <ExternalLink className="w-5 h-5 mr-1.5" />
                            Live
                        </a>
                    )}
                    {proj.github && (
                        <a href={proj.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="View Source">
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
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block"
            >
                Client Projects
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {clientProjects.map((proj, idx) => (
                    <ProjectCard key={idx} proj={proj} idx={idx} />
                ))}
            </div>

            {/* Personal Projects Section */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block pt-4"
            >
                Personal Projects
            </motion.h3>
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
                className="text-center text-gray-400 mt-16"
            >
                Worked on many other projects, check my <a href="https://github.com/AnupDangi" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline font-semibold">GitHub</a> for more details.
            </motion.p>
        </SectionWrapper>
    );
}
