"use client";

import React, { useState, useEffect, useRef } from "react";
import { Book } from "../lib/content";
import MarkdownRenderer from "./MarkdownRenderer";
import { ArrowLeft, Clock, Calendar, CheckCircle, Volume2, Play, Pause, Square, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BookDetailViewProps {
  book: Book;
}

export default function BookDetailView({ book }: BookDetailViewProps) {
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
      const englishVoices = allVoices.filter(
        (v) => v.lang.startsWith("en") || v.lang.startsWith("ne")
      );
      setVoices(englishVoices.length > 0 ? englishVoices : allVoices);

      const defaultVoice =
        englishVoices.find((v) => v.name.includes("Google US English")) ||
        englishVoices.find((v) => v.name.includes("Natural")) ||
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

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getSpeechText = () => {
    const text = book.content
      .replace(/[#*`_-]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();
    return `${book.title} by ${book.author}. My reflection. ${text}`;
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

      {/* Background ambient lighting */}
      <div
        className="absolute top-24 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none -z-10"
        style={{ backgroundColor: book.color }}
      />

      <div className="max-w-5xl mx-auto">
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
            Reading Reflection
          </div>
        </div>

        {/* Dynamic content container */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-surface/30 border border-surface-border rounded-3xl p-6 md:p-10 backdrop-blur-sm">

          {/* Left panel */}
          <div className="w-full md:w-72 flex-shrink-0 flex flex-col items-center">
            {/* Book cover representation */}
            <div
              className="w-44 h-[250px] rounded-2xl shadow-2xl flex flex-col justify-between p-5 border border-white/10 relative overflow-hidden group select-none transition-transform hover:scale-102"
              style={{ backgroundColor: book.color }}
            >
              {book.coverImage ? (
                <>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  {/* Subtle shine / spine line overlay on cover */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 z-10" />
                </>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-white/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 z-10" />

                  <div className="flex flex-col gap-1 z-10">
                    <span className="text-[9px] tracking-wider uppercase font-semibold text-white/50">Book Notes</span>
                    <h3 className="text-sm font-extrabold leading-tight font-serif text-white line-clamp-4">{book.title}</h3>
                  </div>

                  <div className="flex flex-col gap-1.5 z-10">
                    <div className="h-0.5 w-8 bg-neon" />
                    <span className="text-[10px] font-bold text-white/70 truncate">{book.author}</span>
                  </div>
                </>
              )}
            </div>

            {/* Title block */}
            <div className="mt-8 text-center w-full space-y-4">
              <div>
                <h1 className="text-2xl font-bold font-serif text-foreground leading-snug">{book.title}</h1>
                <p className="text-sm text-text-muted font-medium mt-1">by {book.author}</p>
              </div>

              <div className="flex flex-col items-center gap-1.5 pt-2">
                <span className="text-neon text-xl tracking-wider select-none font-semibold">
                  {renderStars(book.rating)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  My Rating
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-surface-border text-left w-full text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-semibold">Status</p>
                    <p className="font-bold text-foreground">{book.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-semibold">Read Date</p>
                    <p className="font-bold text-foreground">{book.dateRead}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Clock className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-semibold">Reading Time</p>
                    <p className="font-bold text-foreground">{book.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Player & Text */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Audio Reader Panel */}
            <div className="mb-8 p-4 rounded-2xl bg-surface/50 border border-surface-border backdrop-blur-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-neon" />
                  <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                    Listen to my review
                  </h4>
                </div>
                <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {book.listeningTime}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-background border border-surface-border p-1.5 rounded-full">
                  <button
                    onClick={handlePlay}
                    className={`p-2 rounded-full transition-all ${isPlaying && !isPaused
                      ? "bg-neon/15 text-neon"
                      : "hover:bg-surface text-foreground/80 hover:text-neon"
                      }`}
                  >
                    {isPlaying && !isPaused ? (
                      <span className="block w-4 h-4 flex items-center justify-center gap-0.5">
                        <span className="w-0.5 h-2.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-0.5 h-3.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-0.5 h-2.5 bg-neon rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </span>
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                  <button
                    onClick={handlePause}
                    disabled={!isPlaying}
                    className={`p-2 rounded-full transition-all ${isPaused ? "bg-neon/15 text-neon" : "hover:bg-surface text-foreground/80 hover:text-neon disabled:opacity-45"
                      }`}
                  >
                    <Pause className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    className="p-2 rounded-full hover:bg-surface text-foreground/80 hover:text-neon transition-all disabled:opacity-45"
                  >
                    <Square className="w-4 h-4 fill-current" />
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
                      {voices.map((voice) => (
                        <option key={voice.name} value={voice.name} className="bg-background text-foreground">
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center gap-3 text-[10px] text-text-muted font-semibold mt-1">
                <span>0%</span>
                <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="absolute left-0 inset-y-0 bg-neon rounded-full"
                  />
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Review content */}
            <div className="prose-invert">
              <MarkdownRenderer content={book.content} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
