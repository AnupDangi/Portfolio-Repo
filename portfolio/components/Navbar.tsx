"use client";
import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        className="md:hidden p-2 rounded focus:outline-none text-white hover:text-neon transition-colors"
                        onClick={() => setMobileOpen((s) => !s)}
                        aria-label="Toggle navigation"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    <a href="#hero" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                        <img src="/logo.svg" alt="AD Logo" width="40" height="40" className="rounded-full w-10 h-10" />
                        <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                            Anup <span className="text-neon">Dangi</span>
                        </span>
                    </a>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#about" className="text-gray-300 hover:text-neon transition-colors">About</a>
                    <a href="#experience" className="text-gray-300 hover:text-neon transition-colors">Experience</a>
                    <a href="#projects" className="text-gray-300 hover:text-neon transition-colors">Projects</a>
                    <a href="#blogs" className="text-gray-300 hover:text-neon transition-colors">Blogs</a>
                    <a href="#contact" className="text-gray-300 hover:text-neon transition-colors">Contact</a>
                </nav>
            </div>
            {/* Mobile nav */}
            {mobileOpen && (
                <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-md">
                    <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
                        <a href="#about" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-neon transition-colors">About</a>
                        <a href="#experience" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-neon transition-colors">Experience</a>
                        <a href="#projects" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-neon transition-colors">Projects</a>
                        <a href="#blogs" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-neon transition-colors">Blogs</a>
                        <a href="#contact" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-neon transition-colors">Contact</a>
                    </div>
                </div>
            )}
        </header>
    );
}
