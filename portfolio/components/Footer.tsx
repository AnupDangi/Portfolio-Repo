"use client";
import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
    {
        label: "GitHub",
        href: "https://github.com/AnupDangi",
        icon: Github,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/anup-dangi",
        icon: Linkedin,
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/8 mt-12 relative z-10"
            style={{ borderColor: "var(--surface-border)" }}
        >
            <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Copyright */}
                <p className="text-sm text-text-muted/70">
                    © {new Date().getFullYear()}{" "}
                    <span className="text-text-muted font-medium">Anup Dangi</span>
                    . All rights reserved.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    {socials.map(({ label, href, icon: Icon }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border text-text-muted hover:text-neon transition-colors duration-200"
                            style={{
                                borderColor: "var(--surface-border)",
                                background: "var(--surface)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "var(--neon-glow-sm)";
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--neon-muted)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--surface-border)";
                            }}
                        >
                            <Icon className="w-4 h-4" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

