"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { sendEmail } from "@/actions/sendEmail";
import SectionWrapper from "./SectionWrapper";
import { Github, Linkedin, Facebook, Instagram, BookOpen, Database } from "lucide-react";

export default function ContactSection() {
    const [pending, setPending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        const result = await sendEmail(new FormData(e.currentTarget));

        if (result.error) {
            setStatus({ type: "error", message: result.error });
        } else {
            setStatus({ type: "success", message: "Message sent! I'll get back to you soon." });
            (e.target as HTMLFormElement).reset();
        }
        setPending(false);
    };

    const socialLinks = [
        { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/anup-dangi/", label: "LinkedIn" },
        { icon: <Github className="w-5 h-5" />, href: "https://github.com/AnupDangi", label: "GitHub" },
        { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/anupdangi22/", label: "Instagram" },
        { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/Anup.Dangi111", label: "Facebook" },
        { icon: <BookOpen className="w-5 h-5" />, href: "https://medium.com/@anupdangi1589", label: "Medium" },
        { icon: <Database className="w-5 h-5" />, href: "https://www.kaggle.com/anupdangi339", label: "Kaggle" },
    ];

    // Stagger variants for Social links
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <SectionWrapper id="contact" title="Get in Touch">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                {/* Left: Socials */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex-1"
                >
                    <p className="text-text-muted text-lg mb-8 leading-relaxed">
                        Have a project in mind, or just want to say hi? Feel free to reach out via the form, or connect with me on social media!
                    </p>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {socialLinks.map((link, idx) => (
                            <motion.a
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                key={idx}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-surface-border hover:border-neon hover:bg-neon/10 transition-colors duration-300 group shadow-lg"
                            >
                                <div className="text-text-muted group-hover:text-neon transition-colors">
                                    {link.icon}
                                </div>
                                <span className="text-text-muted group-hover:text-foreground font-medium transition-colors">
                                    {link.label}
                                </span>
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right: Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="flex-1"
                >
                    <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-surface-border rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden group">
                        {/* Ambient form glow */}
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-neon/20 transition-colors duration-1000" />

                        <h3 className="text-2xl font-bold text-foreground mb-6 relative z-10">Send a Message</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            <input name="name" type="text" required placeholder="Your Name"
                                className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-foreground placeholder-text-muted/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all" />
                            <input name="email" type="email" required placeholder="your@email.com"
                                className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-foreground placeholder-text-muted/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all" />
                        </div>

                        <textarea name="message" required rows={5} placeholder="Your message..."
                            className="w-full bg-background border border-surface-border rounded-xl px-4 py-3 text-foreground placeholder-text-muted/60 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none relative z-10" />

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(24, 210, 110, 0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" disabled={pending}
                            className="relative z-10 w-full bg-neon text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(24,210,110,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {pending ? "Sending..." : "Send Message"}
                        </motion.button>

                        {status.type && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`relative z-10 p-4 rounded-lg text-sm text-center font-medium
                ${status.type === "success"
                                        ? "bg-neon/10 text-neon border border-neon/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                            >
                                {status.message}
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
