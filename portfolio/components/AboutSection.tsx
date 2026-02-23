"use client";

import { motion, Variants } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

export default function AboutSection() {
    const skills = [
        { name: "TypeScript", src: "https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" },
        { name: "React", src: "https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" },
        { name: "Next.js", src: "https://img.shields.io/badge/Next-white?style=for-the-badge&logo=next.js&logoColor=black" },
        { name: "Node.js", src: "https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" },
        { name: "Express", src: "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" },
        { name: "MongoDB", src: "https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" },
        { name: "Supabase", src: "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" },
        { name: "FastAPI", src: "https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" },
        { name: "Django", src: "https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" },
        { name: "Flask", src: "https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white" },
        { name: "TensorFlow", src: "https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" },
        { name: "PyTorch", src: "https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white" },
        { name: "LangChain", src: "https://img.shields.io/badge/LangChain-000000?style=for-the-badge&logo=chainlink&logoColor=white" },
        { name: "Docker", src: "https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" },
        { name: "AWS", src: "https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" },
    ];

    // Grid Stagger configuration
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 200, damping: 20 }
        }
    };

    return (
        <SectionWrapper id="about" title="About Me">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

                {/* Left Column: Text & Education */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 space-y-8"
                >
                    <div className="space-y-4 text-gray-300 text-lg leading-relaxed mix-blend-plus-lighter">
                        <p>
                            I am a <strong className="text-white font-semibold">Full Stack AI Engineer</strong> passionate about building products that
                            help human lives. Currently, I am expanding my expertise in <span className="text-neon">Deep Learning,
                                Reinforcement Learning, LLMs Core, and GenAI</span>, alongside building
                            high-performance full stack applications.
                        </p>
                        <p>
                            I am interested in real-life challenging problems and love doing work that I find challenging and fulfilling.
                        </p>
                    </div>

                    {/* Education Card interactive */}
                    <motion.div
                        whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(24,210,110,0.15)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden group"
                    >
                        {/* Inner hover glow */}
                        <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <h3 className="text-xl font-bold text-white mb-2 relative z-10 flex items-center gap-2">
                            <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                            Education
                        </h3>
                        <p className="text-gray-400 relative z-10 leading-relaxed">
                            4th Year BE AIML <br />
                            <span className="text-gray-300 font-medium">CMRIT College of Engineering</span> <br />
                            Bengaluru, India
                        </p>
                    </motion.div>
                </motion.div>

                {/* Right Column: Skills Grid */}
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        Skills & Tech Stack
                    </h3>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex flex-wrap gap-3"
                    >
                        {skills.map((skill) => (
                            <motion.img
                                variants={itemVariants}
                                whileHover={{ scale: 1.1, rotate: [-2, 2, 0] }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                key={skill.name}
                                src={skill.src}
                                alt={skill.name}
                                className="h-8 rounded cursor-crosshair drop-shadow-md"
                            />
                        ))}
                        <motion.span
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(24, 210, 110, 0.1)" }}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm font-medium text-gray-300 flex items-center transition-colors shadow-sm"
                        >
                            + many more
                        </motion.span>
                    </motion.div>
                </div>
            </div>
        </SectionWrapper>
    );
}
