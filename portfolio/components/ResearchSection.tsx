"use client";

import React from "react";
import SectionWrapper from "./SectionWrapper";
import { BrainCircuit, Cpu, Database, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function ResearchSection() {
  const researches = [
    "Coming Soon..."
  ];

  return (
    <SectionWrapper id="research" title="Research & Experiments">
      <div className="max-w-xl mx-auto text-center mb-12">
        <p className="text-sm text-text-muted leading-relaxed">
          Uncovering contrarian truths and testing ideas at the boundary of software engineering, artificial intelligence, and biological systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {researches.map((res, idx) => (
          res
        ))}
      </div>
    </SectionWrapper>
  );
}
