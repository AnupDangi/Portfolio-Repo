"use client";

import { motion, Variants } from "framer-motion";

export default function HeroSection() {
    // Stagger variants for text
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const childVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50, damping: 10 }
        },
    };

    return (
        <section id="hero" className="min-h-[100svh] flex items-center justify-center pt-24 px-6 md:pt-0 relative">
            <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">

                {/* Left Text Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 space-y-6 text-center md:text-left z-10"
                >
                    <motion.h1
                        variants={childVariants}
                        className="text-4xl sm:text-6xl font-extrabold tracking-tight"
                    >
                        Hi, I'm <span className="text-neon inline-block relative">
                            Anup Dangi
                            {/* Subtle underline accent */}
                            <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                                className="absolute -bottom-2 left-0 h-1 bg-neon/50 rounded-full"
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={childVariants}
                        className="text-xl text-gray-400 max-w-2xl mx-auto md:mx-0 leading-relaxed"
                    >
                        Full Stack Developer & AI Engineer building products that improve human lives.
                    </motion.p>

                    <motion.div
                        variants={childVariants}
                        className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
                    >
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(24, 210, 110, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="px-8 py-3 rounded-full bg-neon text-black font-bold border border-transparent"
                        >
                            Get in Touch
                        </motion.a>
                        <motion.a
                            href="/Resume.pdf"
                            target="_blank"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="px-8 py-3 rounded-full border border-white/20 text-white font-medium"
                        >
                            View Resume
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Right Image Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
                    className="relative w-64 h-64 sm:w-80 sm:h-80 z-10 perspective-[1000px]"
                >
                    {/* Constant subtle float animation post-entrance */}
                    <motion.div
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full relative"
                    >
                        {/* Glowing backdrop */}
                        <div className="absolute inset-0 bg-neon/20 rounded-full blur-2xl animate-pulse" />

                        {/* Main Image */}
                        <img
                            src="/newpp.jpeg"
                            alt="Anup Dangi"
                            className="rounded-full object-cover w-full h-full border-[3px] border-white/10 shadow-[0_0_40px_rgba(24,210,110,0.15)] relative z-10 pointer-events-none"
                        />

                        {/* Orbiting accent dot (adds a techy vibe) */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-10px] rounded-full border border-dashed border-white/10"
                        >
                            <div className="absolute top-0 left-1/2 w-3 h-3 bg-neon rounded-full shadow-[0_0_10px_#18D26E]" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
