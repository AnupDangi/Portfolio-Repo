import { ReactNode } from "react";

interface SectionWrapperProps {
    id: string;
    title: string;
    children: ReactNode;
}

export default function SectionWrapper({ id, title, children }: SectionWrapperProps) {
    return (
        <section id={id} className="py-20 px-6 sm:px-12 md:px-24 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <div className="w-12 h-1 bg-neon rounded mb-12" /> {/* neon underline */}
            {children}
        </section>
    );
}
