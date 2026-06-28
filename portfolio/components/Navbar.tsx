"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initialTheme = savedTheme || (systemPrefersLight ? "light" : "dark");

        setTheme(initialTheme);
        if (initialTheme === "light") {
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        if (nextTheme === "light") {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-md border-b border-surface-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        className="md:hidden p-2 rounded focus:outline-none text-foreground hover:text-neon transition-colors"
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
                        <img src="/logo.svg" alt="AD Logo" width="40" height="40" className="rounded-full w-10 h-10 border border-surface-border" />
                        <span className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                            Anup <span className="text-neon">Dangi</span>
                        </span>
                    </a>
                </div>
                
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
                        <a href="#hero" className="text-foreground/80 hover:text-neon transition-colors">Home</a>
                        <a href="#projects" className="text-foreground/80 hover:text-neon transition-colors">Projects</a>
                        <a href="#research" className="text-foreground/80 hover:text-neon transition-colors">Research</a>
                        <a href="#writing" className="text-foreground/80 hover:text-neon transition-colors">Articles</a>
                        <a href="#reading" className="text-foreground/80 hover:text-neon transition-colors">Reading</a>
                        <a href="#contact" className="text-foreground/80 hover:text-neon transition-colors">Contact</a>
                    </nav>

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full border border-surface-border bg-surface hover:bg-surface-hover hover:border-neon/30 text-foreground transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-4.5 h-4.5 text-neon" />
                        ) : (
                            <Moon className="w-4.5 h-4.5 text-neon" />
                        )}
                    </button>
                </div>
            </div>
            {/* Mobile nav */}
            {mobileOpen && (
                <div className="md:hidden border-t border-surface-border bg-background/95 backdrop-blur-md">
                    <div className="px-4 sm:px-6 py-4 flex flex-col gap-4 font-semibold text-sm">
                        <a href="#hero" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Home</a>
                        <a href="#projects" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Projects</a>
                        <a href="#research" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Research</a>
                        <a href="#writing" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Articles</a>
                        <a href="#reading" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Reading</a>
                        <a href="#contact" onClick={() => setMobileOpen(false)} className="text-foreground/80 hover:text-neon transition-colors">Contact</a>
                    </div>
                </div>
            )}
        </header>
    );
}
