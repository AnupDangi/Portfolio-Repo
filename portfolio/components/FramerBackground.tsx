"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FramerBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            {/* Base ambient blobs */}
            <motion.div
                animate={{
                    x: [0, 40, 0, -20, 0],
                    y: [0, -30, 20, -10, 0],
                    scale: [1, 1.2, 0.9, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-neon/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -50, 20, -30, 0],
                    y: [0, 40, -10, 30, 0],
                    scale: [1, 0.8, 1.1, 0.9, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-neon/10 rounded-full blur-[140px]"
            />

            {/* Interactive mouse-following soft glow */}
            <motion.div
                className="absolute w-[20rem] h-[20rem] bg-neon/15 rounded-full blur-[100px] pointer-events-none hidden md:block"
                animate={{
                    x: mousePosition.x - 160, // Adjust centering based on width/2
                    y: mousePosition.y - 160,
                }}
                transition={{
                    type: "spring",
                    damping: 40,
                    stiffness: 100,
                    mass: 0.5,
                }}
            />
        </div>
    );
}
