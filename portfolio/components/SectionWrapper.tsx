"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
    id: string;
    title: string;
    children: ReactNode;
}

export default function SectionWrapper({ id, title, children }: SectionWrapperProps) {
    return (
        <section id={id} className="py-20 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto">
            {/* Animated section heading with asymmetric accent */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-12"
            >
                <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                {/* Asymmetric left-border gradient accent — replaces the generic centered underline */}
                <div className="mt-3 flex items-center gap-3">
                    <div
                        className="w-1 h-6 rounded-full"
                        style={{ background: "var(--neon)" }}
                    />
                    <div
                        className="h-px flex-1 max-w-[160px] rounded"
                        style={{
                            background: "linear-gradient(to right, var(--neon-muted), transparent)",
                        }}
                    />
                </div>
            </motion.div>
            {children}
        </section>
    );
}

