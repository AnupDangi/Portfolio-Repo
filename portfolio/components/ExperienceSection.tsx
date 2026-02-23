"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionWrapper from "./SectionWrapper";

export default function ExperienceSection() {
    const experiences = [
        {
            role: "Freelance / Building Client Projects",
            company: "Self-Employed",
            location: "Bengaluru, India",
            period: "October 2025 - Present",
            description: "Building client projects and learning AI in depth with hands-on projects.",
        },
        {
            role: "Engineering Intern",
            company: "Areta360 Technologies Private Limited",
            location: "Bengaluru, India",
            period: "April 2025 - October 2025",
            description: "Worked on Diffusion Models and Virtual Try-on Applications. Wrote LLM Agents using Google ADK. Implemented human-in-the-loop to validate AI responses and drive the flow of execution. Designed Database Schemas and used indexes for faster retrieval.",
        }
    ];

    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll logic for the drawing line effect
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Calculate the height of the line based on scroll
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <SectionWrapper id="experience" title="Experience">
            <div className="relative" ref={containerRef}>

                {/* The Animated Timeline connecting line */}
                <div className="absolute left-4 md:left-[30%] top-0 bottom-0 w-[2px] bg-white/10 rounded-full" />
                <motion.div
                    style={{ height: lineHeight }}
                    className="absolute left-4 md:left-[30%] top-0 w-[2px] bg-neon rounded-full"
                />

                <div className="space-y-12 pl-12 md:pl-0 pt-4">
                    {experiences.map((exp, idx) => (
                        <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-12">

                            {/* Timeline Dot */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                className="absolute -left-[41px] md:left-[calc(30%-7px)] top-2 w-4 h-4 rounded-full bg-black border-2 border-neon flex items-center justify-center z-10 shadow-[0_0_10px_#18D26E]"
                            >
                                <div className="w-1.5 h-1.5 bg-neon rounded-full" />
                            </motion.div>

                            {/* Left Side: Meta info (Desktop only layout) */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className="md:w-[28%] shrink-0 md:text-right pt-1 hidden md:block"
                            >
                                <span className="inline-block px-3 py-1 bg-neon/10 text-neon text-sm font-semibold rounded-full mb-3 border border-neon/20">
                                    {exp.period}
                                </span>
                                <p className="text-gray-400 font-medium">{exp.company}</p>
                                <p className="text-gray-500 text-sm mt-1">{exp.location}</p>
                            </motion.div>

                            {/* Right Side: Content Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                whileHover={{ y: -5 }}
                                className="md:w-[65%] w-full"
                            >
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm hover:border-neon/40 transition-colors duration-300 relative overflow-hidden group">
                                    {/* Subtle gradient hover inside card */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Mobile Meta (Hidden on Desktop) */}
                                    <div className="md:hidden mb-4">
                                        <span className="inline-block px-3 py-1 bg-neon/10 text-neon text-sm font-semibold rounded-full mb-3 border border-neon/20">
                                            {exp.period}
                                        </span>
                                        <p className="text-gray-400 font-medium">{exp.company}</p>
                                        <p className="text-gray-500 text-sm">{exp.location}</p>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 relative z-10">
                                        {exp.role}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-base sm:text-lg relative z-10">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>

                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}
