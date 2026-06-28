"use client";

import React, { useState } from "react";
import { Book } from "../lib/content";
import ReviewOverlay from "./ReviewOverlay";
import SectionWrapper from "./SectionWrapper";
import { BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingSectionProps {
  initialBooks: Book[];
}

function Book3D({ book, onClick }: { book: Book; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback cover gradient based on theme color
  const coverBg = book.color || "#1e1b4b";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative h-[240px] transition-all duration-500 ease-in-out cursor-pointer select-none"
      style={{
        width: isHovered ? "180px" : "45px",
        perspective: "1000px",
      }}
    >
      {/* 3D Wrapper */}
      <div
        className="w-full h-full relative transition-transform duration-500 ease-in-out origin-left"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateY(-90deg) translateX(-45px)" : "rotateY(0deg)",
        }}
      >
        {/* SPINE FACE (Visible initially) */}
        <div
          className="absolute inset-y-0 left-0 w-[45px] h-full flex flex-col justify-between items-center py-4 border-r border-white/10 shadow-[2px_0_5px_rgba(0,0,0,0.3)] z-20 transition-all duration-300"
          style={{
            backgroundColor: book.spineColor || coverBg,
            transform: "rotateY(0deg) translateZ(0px)",
          }}
        >
          {/* Crease line on left */}
          <div className="absolute top-0 bottom-0 left-1 w-0.5 bg-black/20" />
          
          <div className="text-[9px] uppercase tracking-widest font-bold text-white/40 font-mono select-none">
            {book.rating} ★
          </div>
          
          <h3
            className="font-serif font-bold text-xs tracking-wide text-white/90 whitespace-nowrap overflow-hidden text-ellipsis w-[170px] select-none text-center"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {book.title}
          </h3>

          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
        </div>

        {/* COVER FACE (Folded back by 90deg, visible on rotate) */}
        <div
          className="absolute inset-y-0 left-[45px] w-[135px] h-full flex flex-col justify-between p-3 border border-white/5 shadow-2xl z-10 origin-left overflow-hidden"
          style={{
            backgroundColor: coverBg,
            transform: "rotateY(90deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {book.coverImage ? (
            <>
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              {/* Subtle spine line overlay */}
              <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-white/20 to-transparent z-10" />
            </>
          ) : (
            <>
              {/* Book cover shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/15 to-transparent pointer-events-none" />

              {/* Book title & rating */}
              <div className="flex flex-col gap-1 z-10">
                <span className="text-[8px] uppercase tracking-widest font-semibold text-white/40 font-mono">
                  Review
                </span>
                <h4 className="text-[11px] font-bold font-serif leading-tight text-white line-clamp-3">
                  {book.title}
                </h4>
              </div>

              {/* Book author & status indicator */}
              <div className="flex flex-col gap-1 z-10">
                <div className="h-0.5 w-6 bg-neon" />
                <span className="text-[9px] text-white/60 font-medium truncate">
                  {book.author}
                </span>
                <span className="text-[7px] font-bold text-neon uppercase tracking-wider">
                  {book.status}
                </span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ReadingSection({ initialBooks }: ReadingSectionProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <SectionWrapper id="reading" title="Reading Shelf">
      
      {/* Shelf description */}
      <div className="max-w-xl mx-auto text-center mb-12">
        <p className="text-sm text-text-muted leading-relaxed">
          My digital bookshelf and notes. Click on any book spine to slide it off the shelf and read my direct, unfiltered reflections on how it shaped my engineering and product thinking.
        </p>
      </div>

      {/* Virtual Bookshelf Container */}
      <div className="relative max-w-4xl mx-auto px-4 py-8">
        
        {/* Backboard shading */}
        <div className="absolute inset-x-0 top-6 bottom-10 bg-gradient-to-b from-black/20 to-black/40 border border-surface-border rounded-2xl -z-10" />

        {/* Books shelf stack row */}
        <div className="flex items-end justify-center gap-1.5 h-[280px] px-8 border-b-8 border-surface-border relative select-none">
          {initialBooks.map((book) => (
            <Book3D
              key={book.slug}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}

          {/* Visual Shelf Depth Shadow */}
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
        
        {/* Support brackets on bottom */}
        <div className="flex justify-between px-16 mt-0.5">
          <div className="w-4 h-6 bg-surface-border rounded-b" />
          <div className="w-4 h-6 bg-surface-border rounded-b" />
        </div>
      </div>

      {/* Review details overlay */}
      <AnimatePresence>
        {selectedBook && (
          <ReviewOverlay
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </AnimatePresence>

      <div className="text-center mt-12 text-xs text-text-muted flex items-center justify-center gap-2 font-medium">
        <BookOpen className="w-4 h-4 text-neon" />
        <span>Compound learning through technical reflection</span>
      </div>

    </SectionWrapper>
  );
}
