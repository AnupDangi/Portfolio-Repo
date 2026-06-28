"use client";

import React, { useState, useEffect, useRef } from "react";
import { Book } from "../lib/content";
import MarkdownRenderer from "./MarkdownRenderer";
import { X, Play, Pause, Square, Volume2, Clock, Calendar, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewOverlayProps {
  book: Book | null;
  onClose: () => void;
}

export default function ReviewOverlay({ book, onClose }: ReviewOverlayProps) {
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

  // Load browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter for English or default system voices
      const englishVoices = allVoices.filter(
        (v) => v.lang.startsWith("en") || v.lang.startsWith("ne")
      );
      setVoices(englishVoices.length > 0 ? englishVoices : allVoices);

      // Set default voice
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
    };
  }, []);

  // Sync rate and voice settings if utterance changes mid-flight
  useEffect(() => {
    if (isPlaying && !isPaused && utteranceRef.current) {
      // Unfortunately, SpeechSynthesis doesn't support changing voice/rate dynamically
      // while speaking in all browsers. The safest path is stopping and starting over,
      // or warning that rate changes apply to next speak.
    }
  }, [rate, selectedVoice]);

  // Cleanup speech on modal close
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [book]);

  if (!book) return null;

  // Render Star Rating
  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Extract clean text for speech synthesis
  const getSpeechText = () => {
    // Strip markdown headings and symbols for smoother speaking
    const text = book.content
      .replace(/[#*`_-]/g, "") // Strip md characters
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Strip links, keep text
      .trim();
    
    return `${book.title} by ${book.author}. My reflection on this book. ${text}`;
  };

  const handlePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // If paused, resume
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

    // Cancel active synthesis first
    window.speechSynthesis.cancel();
    if (playTimerRef.current) clearInterval(playTimerRef.current);

    const cleanText = getSpeechText();
    const textLength = cleanText.length;
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMs = (wordCount / (140 * rate)) * 60 * 1000;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Apply voice
    if (selectedVoice) {
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    // Apply rate
    utterance.rate = rate;

    startTimeRef.current = Date.now();
    elapsedPausedRef.current = 0;
    hasBoundaryRef.current = false;

    // Tracking progress via characters spoken
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        hasBoundaryRef.current = true;
        const percentage = Math.min((event.charIndex / textLength) * 100, 100);
        setProgress(percentage);
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

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
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
        className="relative bg-background border border-surface-border text-foreground rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2.5 rounded-full bg-surface/50 border border-surface-border text-foreground/80 hover:text-neon hover:bg-surface transition-colors"
          aria-label="Close review"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Book Cover Card & Meta Info */}
        <div 
          className="w-full md:w-80 flex-shrink-0 p-6 md:p-8 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-surface-border relative overflow-hidden"
          style={{ backgroundColor: `${book.color}15` }}
        >
          {/* Subtle atmospheric backdrop blur matching book theme color */}
          <div 
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: book.color }}
          />

          <div className="w-full flex flex-col items-center">
            {/* Book Cover Design */}
            <div 
              className="w-40 h-56 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between p-4 border border-white/10 relative overflow-hidden group select-none mt-4 transition-transform hover:scale-102"
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
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 z-10" />
                </>
              ) : (
                <>
                  {/* Highlight Overlay */}
                  <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-white/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10" />

                  <div className="flex flex-col gap-1 z-10">
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-white/50">Book Review</span>
                    <h3 className="text-sm font-bold leading-tight font-serif text-white line-clamp-3">{book.title}</h3>
                  </div>

                  <div className="flex flex-col gap-1.5 z-10">
                    <div className="h-0.5 w-8 bg-neon" />
                    <span className="text-[10px] font-medium text-white/60 truncate">{book.author}</span>
                  </div>
                </>
              )}
            </div>

            {/* Ratings and Stats */}
            <div className="mt-8 text-center w-full space-y-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground font-serif">{book.title}</h1>
                <p className="text-sm text-text-muted font-medium mt-1">by {book.author}</p>
              </div>

              <div className="flex flex-col items-center gap-1.5 pt-2">
                <span className="text-neon text-lg tracking-wider font-semibold select-none">
                  {renderStars(book.rating)}
                </span>
                <span className="text-xs uppercase font-semibold tracking-wider text-text-muted">
                  My Rating
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-surface-border text-left w-full text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-medium">Status</p>
                    <p className="font-semibold text-foreground">{book.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-medium">Read Date</p>
                    <p className="font-semibold text-foreground">{book.dateRead}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Clock className="w-4 h-4 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-text-muted font-medium">Estimated Reading Time</p>
                    <p className="font-semibold text-foreground">{book.readTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="h-4 md:h-0" />
        </div>

        {/* Right Side: Speech Synthesis Player & Book Review Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col max-h-full">
          
          {/* Speech Player Interface */}
          <div className="mb-6 p-4 rounded-2xl bg-surface/50 border border-surface-border backdrop-blur-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-neon" />
                <h4 className="text-sm font-semibold tracking-wide text-foreground uppercase">
                  Listen to my review
                </h4>
              </div>
              <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {book.listeningTime}
              </span>
            </div>

            {/* Audio Controls Grid */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Play / Pause / Stop buttons */}
              <div className="flex items-center gap-2 bg-background border border-surface-border p-1.5 rounded-full">
                <button
                  onClick={handlePlay}
                  className={`p-2 rounded-full transition-all ${
                    isPlaying && !isPaused
                      ? "bg-neon/10 text-neon"
                      : "hover:bg-surface text-foreground/80 hover:text-neon"
                  }`}
                  title={isPaused ? "Resume" : "Play"}
                >
                  {isPlaying && !isPaused ? (
                    <span className="block w-4 h-4 relative flex items-center justify-center gap-0.5">
                      <span className="w-0.5 h-3 bg-neon rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-0.5 h-4 bg-neon rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 h-3 bg-neon rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </span>
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  className={`p-2 rounded-full transition-all ${
                    isPaused
                      ? "bg-neon/10 text-neon"
                      : "hover:bg-surface text-foreground/80 hover:text-neon disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground/80"
                  }`}
                  title="Pause"
                >
                  <Pause className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="p-2 rounded-full hover:bg-surface text-foreground/80 hover:text-neon transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground/80"
                  title="Stop"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1.5 rounded-full text-xs">
                <span className="text-text-muted font-medium">Speed:</span>
                <select
                  value={rate}
                  onChange={(e) => {
                    setRate(parseFloat(e.target.value));
                    if (isPlaying) {
                      // Restart with new speed
                      handlePlay();
                    }
                  }}
                  className="bg-transparent text-foreground font-semibold outline-none cursor-pointer focus:ring-0 select-none border-none py-0 pl-0 pr-6"
                >
                  <option value="1" className="bg-background text-foreground">1.0x</option>
                  <option value="1.25" className="bg-background text-foreground">1.25x</option>
                  <option value="1.5" className="bg-background text-foreground">1.5x</option>
                  <option value="2" className="bg-background text-foreground">2.0x</option>
                </select>
              </div>

              {/* Voice Selection Dropdown */}
              {voices.length > 0 && (
                <div className="flex-1 min-w-[150px] flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1.5 rounded-full text-xs">
                  <span className="text-text-muted font-medium flex-shrink-0">Voice:</span>
                  <select
                    value={selectedVoice}
                    onChange={(e) => {
                      setSelectedVoice(e.target.value);
                      if (isPlaying) {
                        handlePlay();
                      }
                    }}
                    className="bg-transparent text-foreground font-semibold outline-none cursor-pointer focus:ring-0 select-none truncate w-full border-none py-0 pl-0 pr-6"
                  >
                    {voices.map((voice) => (
                      <option 
                        key={voice.name} 
                        value={voice.name}
                        className="bg-background text-foreground"
                      >
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Progress Slider bar */}
            <div className="w-full flex items-center gap-3 text-[10px] text-text-muted font-semibold mt-1">
              <span>0%</span>
              <div className="flex-1 h-1.5 bg-surface-border rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  className="absolute left-0 inset-y-0 bg-neon rounded-full"
                />
              </div>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Book Review Text content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <MarkdownRenderer content={book.content} />
          </div>

        </div>

      </motion.div>
    </div>
  );
}
