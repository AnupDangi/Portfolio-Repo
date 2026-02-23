"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import React, { useRef } from "react";

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

                <div className="flex flex-wrap gap-2 mt-auto pt-4 mb-6 relative z-10">
                    {proj.tech.map((t: string) => (
                        <span key={t} className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300 shadow-sm border border-white/5">
                            {t}
                        </span>
                    ))}
                </div>

                <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center text-sm font-semibold text-neon hover:text-white transition-colors relative z-10 w-fit"
                >
                    View Project
                    <motion.svg
                        whileHover={{ x: 5 }}
                        className="w-4 h-4 ml-1"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </motion.svg>
                </a>
            </div>
        </motion.div>
    );
}

export default function ProjectsSection() {
    const projects = [
        {
            title: "PRIMEFACE Engineering",
            link: "https://theprimeface.com",
            tech: ["Next.js", "Payment", "eSewa", "Email Automation"],
            description: "Professional Vastu-integrated consultancy platform featuring eSewa payment integration for service bookings and automated transactional email delivery.",
        },
        {
            title: "Portfolio: Er. Bikram Babu KC",
            link: "https://bikrambabu.com.np",
            tech: ["Next.js", "Portfolio", "Personal Branding"],
            description: "Professional personal brand portfolio for a civil engineer and Vastu consultant highlighting experience, academic achievements, and project history.",
        },
        {
            title: "AICOLEARN (Paused AI Product)",
            link: "https://youtu.be/gs5YvjoeXEA",
            tech: ["AI", "WebRTC", "Collaboration", "RAG"],
            description: "AI-powered collaborative learning platform featuring real-time WebRTC audio/video, whiteboarding (tldraw), synchronous code collaboration (yjs), and multi-modal AI tools.",
        },
        {
            title: "SAI: Smart AI Interviewer",
            link: "https://smart-ai-interviewer-sai.vercel.app/",
            tech: ["AI", "Next.js"],
            description: "An intelligent platform for conducting and analyzing AI-driven mock interviews.",
        },
        {
            title: "A Trading Platform: Zerodha Clone",
            link: "https://zerodha-clone-ykwn.vercel.app/",
            tech: ["React", "Fullstack"],
            description: "A comprehensive trading platform clone featuring real-time market data capabilities.",
        },
        {
            title: "Student Safety Tracker",
            link: "https://github.com/AnupDangi/StudentSafetyTracking_5thSem.git",
            tech: ["Tracking", "Safety", "CV"],
            description: "A platform where international students provide attendance through live face detection and location tracking.",
        },
        {
            title: "Multi-Modal RAG using local LLM",
            link: "https://github.com/AnupDangi/SIH25231-Multi-Modal-RAG",
            tech: ["RAG", "LLM", "Python", "Local"],
            description: "Multimodal RAG utilizing local Ollama models and CLIP for images to regenerate indexed chunks with citations.",
        }
    ];

    return (
        <SectionWrapper id="projects" title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((proj, idx) => (
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
                Worked on many other projects, check my <a href="https://github.com/AnupDangi" target="_blank" className="text-neon hover:underline font-semibold">GitHub</a> for more details.
            </motion.p>
        </SectionWrapper>
    );
}
