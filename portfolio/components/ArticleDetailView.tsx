"use client";

import React, { useState, useEffect, useRef } from "react";
import { Article } from "../lib/content";
import MarkdownRenderer from "./MarkdownRenderer";
import { ArrowLeft, Clock, Calendar, Volume2, Play, Pause, Square, Tag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ArticleDetailViewProps {
  article: Article;
}

export default function ArticleDetailView({ article }: ArticleDetailViewProps) {
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

  const getSpeechText = () => {
    const text = article.content
      .replace(/[#*`_-]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();
    return `${article.title}. Published ${article.date}. ${text}`;
  };

  const handlePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      
      startTimeRef.current = Date.now() - elapsedPausedRef.current;
      const cleanText = getSpeechText();
      const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
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

    const cleanText = getSpeechText();
    const textLength = cleanText.length;
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMs = (wordCount / (140 * rate)) * 60 * 1000;
    const utterance = new SpeechSynthesisUtterance(cleanText);
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
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
      elapsedPausedRef.current = 0;
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
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-28 px-4 sm:px-6 relative z-0">
      
      <div className="absolute top-24 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-5 bg-neon/30 pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-surface-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-neon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <div className="text-sm font-mono tracking-wider font-bold text-neon uppercase">
            Technical Article
          </div>
        </div>

        {/* Article Details Layout */}
        <div className="bg-surface/30 border border-surface-border rounded-3xl p-6 md:p-10 backdrop-blur-sm">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 text-xs text-text-muted mb-3 font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight font-serif">
              {article.title}
            </h1>
            <p className="text-text-muted font-medium mt-3 text-base italic">
              {article.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, tIdx) => (
              <span 
                key={tIdx} 
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neon bg-neon/10 px-2.5 py-1 rounded-md"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="mb-8 overflow-hidden rounded-2xl border border-surface-border shadow-lg">
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="w-full h-auto max-h-[380px] object-cover"
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
              <div className="flex items-center gap-1.5 bg-background border border-surface-border p-1.5 rounded-full">
                <button
                  onClick={handlePlay}
                  className={`p-1.5 rounded-full transition-all ${
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
                  className={`p-1.5 rounded-full transition-all ${
                    isPaused ? "text-neon bg-neon/15" : "text-foreground/80 hover:text-neon disabled:opacity-40"
                  }`}
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="p-1.5 rounded-full text-foreground/80 hover:text-neon transition-all disabled:opacity-40"
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
          <div className="prose-invert">
            <MarkdownRenderer content={article.content} />
          </div>

        </div>
      </div>
    </div>
  );
}
