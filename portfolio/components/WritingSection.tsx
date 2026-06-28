"use client";

import React, { useState, useEffect, useRef } from "react";
import { Article } from "../lib/content";
import MarkdownRenderer from "./MarkdownRenderer";
import SectionWrapper from "./SectionWrapper";
import { X, Play, Pause, Square, Volume2, Clock, Calendar, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

interface WritingSectionProps {
  initialArticles: Article[];
}

function ArticleCard({ article, idx, onClick }: { article: Article; idx: number; onClick: () => void }) {
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
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full perspective-[1000px] z-10 cursor-pointer"
    >
      <div
        className="bg-surface border border-surface-border hover:border-neon/30 rounded-2xl p-6 shadow-2xl backdrop-blur-sm h-full flex flex-col group relative overflow-hidden transition-colors"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {article.coverImage && (
          <div className="relative w-full h-40 mb-4 overflow-hidden rounded-xl border border-surface-border">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-text-muted mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-neon transition-colors relative z-10 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-text-muted text-sm mb-6 relative z-10 leading-relaxed line-clamp-3">
          {article.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag, tIdx) => (
            <span key={tIdx} className="text-[10px] font-semibold uppercase tracking-wider text-neon bg-neon/10 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <button
          className="mt-auto inline-flex items-center text-sm font-semibold text-neon hover:text-foreground transition-colors relative z-10 w-fit gap-1"
        >
          Read Article
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}

// Inline Article Reader with Speech Synthesis
function ArticleOverlay({ article, onClose }: { article: Article; onClose: () => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playTimerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedPausedRef = useRef<number>(0);
  const hasBoundaryRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter((v) => v.lang.startsWith("en"));
      setVoices(englishVoices.length > 0 ? englishVoices : allVoices);

      const defaultVoice =
        englishVoices.find((v) => v.name.includes("Google US English")) ||
        englishVoices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      
      startTimeRef.current = Date.now() - elapsedPausedRef.current;
      const cleanText = article.content
        .replace(/[#*`_-]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();
      const fullText = `${article.title}. Published ${article.date}. ${cleanText}`;
      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
      const estimatedDurationMs = (wordCount / (140 * rate)) * 60 * 1000;

      if (playTimerRef.current) clearInterval(playTimerRef.current);
      playTimerRef.current = setInterval(() => {
        if (hasBoundaryRef.current) return;
        const elapsed = Date.now() - startTimeRef.current;
        const calculatedProgress = Math.min((elapsed / estimatedDurationMs) * 100, 99);
        setProgress(calculatedProgress);
      }, 100);
      return;
    }

    window.speechSynthesis.cancel();
    if (playTimerRef.current) clearInterval(playTimerRef.current);

    // Clean markdown text for speech
    const cleanText = article.content
      .replace(/[#*`_-]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    const fullText = `${article.title}. Published ${article.date}. ${cleanText}`;
    const textLength = fullText.length;
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMs = (wordCount / (140 * rate)) * 60 * 1000;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.rate = rate;

    startTimeRef.current = Date.now();
    elapsedPausedRef.current = 0;
    hasBoundaryRef.current = false;

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        hasBoundaryRef.current = true;
        setProgress(Math.min((event.charIndex / textLength) * 100, 100));
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
      elapsedPausedRef.current = 0;
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
      elapsedPausedRef.current = 0;
      utteranceRef.current = null;
    };

    setIsPlaying(true);
    setIsPaused(false);
    setProgress(0);

    playTimerRef.current = setInterval(() => {
      if (hasBoundaryRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const calculatedProgress = Math.min((elapsed / estimatedDurationMs) * 100, 99);
      setProgress(calculatedProgress);
    }, 100);

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
      elapsedPausedRef.current = Date.now() - startTimeRef.current;
    }
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    elapsedPausedRef.current = 0;
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    utteranceRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-background border border-surface-border text-foreground rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2.5 rounded-full bg-surface/50 border border-surface-border text-foreground/80 hover:text-neon hover:bg-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Article Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 text-xs text-text-muted mb-2 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-surface-border shadow-md">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-auto max-h-[280px] object-cover"
              />
            </div>
          )}

          {/* Audio speech player */}
          <div className="mb-8 p-4 rounded-2xl bg-surface border border-surface-border flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4.5 h-4.5 text-neon" />
                <span className="text-xs uppercase tracking-wider font-bold text-foreground">
                  Listen to this article
                </span>
              </div>
              <span className="text-[11px] font-semibold text-text-muted">
                {article.listeningTime}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-background border border-surface-border p-1 rounded-full">
                <button
                  onClick={handlePlay}
                  className={`p-1.5 rounded-full ${
                    isPlaying && !isPaused ? "text-neon bg-neon/15" : "text-foreground/80 hover:text-neon"
                  }`}
                >
                  {isPlaying && !isPaused ? (
                    <span className="block w-4 h-4 flex items-center justify-center gap-0.5">
                      <span className="w-0.5 h-2.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-0.5 h-3.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 h-2.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </span>
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className={`p-1.5 rounded-full ${
                    isPaused ? "text-neon bg-neon/15" : "text-foreground/80 hover:text-neon disabled:opacity-40"
                  }`}
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="p-1.5 rounded-full text-foreground/80 hover:text-neon disabled:opacity-40"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1.5 rounded-full text-xs">
                <span className="text-text-muted font-medium">Speed:</span>
                <select
                  value={rate}
                  onChange={(e) => {
                    setRate(parseFloat(e.target.value));
                    if (isPlaying) handlePlay();
                  }}
                  className="bg-transparent text-foreground font-semibold outline-none cursor-pointer border-none p-0 pr-6"
                >
                  <option value="1" className="bg-background text-foreground">1.0x</option>
                  <option value="1.25" className="bg-background text-foreground">1.25x</option>
                  <option value="1.5" className="bg-background text-foreground">1.5x</option>
                  <option value="2" className="bg-background text-foreground">2.0x</option>
                </select>
              </div>

              {voices.length > 0 && (
                <div className="flex-1 min-w-[150px] flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1.5 rounded-full text-xs">
                  <span className="text-text-muted font-medium flex-shrink-0">Voice:</span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      if (isPlaying) handlePlay();
                    }}
                    className="bg-transparent text-foreground font-semibold outline-none cursor-pointer truncate w-full border-none p-0 pr-6"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name} className="bg-background text-foreground">
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="w-full flex items-center gap-3 text-[10px] text-text-muted font-semibold mt-1">
              <span>0%</span>
              <div className="flex-1 h-1 bg-surface-border rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute left-0 inset-y-0 bg-neon rounded-full"
                />
              </div>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Body content */}
          <div className="scrollbar-thin">
            <MarkdownRenderer content={article.content} />
          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default function WritingSection({ initialArticles }: WritingSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <SectionWrapper id="writing" title="Technical Writing">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {initialArticles.map((article, idx) => (
          <ArticleCard
            key={article.slug}
            article={article}
            idx={idx}
            onClick={() => setSelectedArticle(article)}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center text-text-muted mt-16 text-sm"
      >
        Read more on my{" "}
        <a
          href="https://medium.com/@anupdangi1589"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon hover:underline font-semibold"
        >
          Medium Profile
        </a>.
      </motion.p>

      {/* Article dynamic reading overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleOverlay
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
