"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import React, { useRef } from "react";

function BlogCard({ blog, idx }: { blog: any, idx: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
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
                style={{ transform: "translateZ(30px)" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon transition-colors relative z-10">
                    {blog.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 relative z-10 leading-relaxed">
                    {blog.description}
                </p>

                <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center text-sm font-semibold text-neon hover:text-white transition-colors relative z-10 w-fit"
                >
                    Read Article
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

export default function BlogsSection() {
    const blogs = [
        {
            title: "Backend and System Design for 2026",
            link: "https://medium.com/@anupdangi1589/backend-and-system-design-for-2026-fba54af706f7",
            description: "Exploring the evolution of backend architecture and modern system design principles looking ahead.",
        },
        {
            title: "How I Learnt Data Engineering in Jan 2026",
            link: "https://medium.com/@anupdangi1589/how-i-learnt-data-engineering-in-jan-2026-476ad1c09869",
            description: "My comprehensive journey diving deep into Data Engineering concepts, tools, and best practices.",
        }
    ];

    return (
        <SectionWrapper id="blogs" title="Recent Articles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {blogs.map((blog, idx) => (
                    <BlogCard key={idx} blog={blog} idx={idx} />
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-center text-gray-400 mt-16"
            >
                Read more on my <a href="https://medium.com/@anupdangi1589" target="_blank" className="text-neon hover:underline font-semibold">Medium Profile</a>.
            </motion.p>
        </SectionWrapper>
    );
}
