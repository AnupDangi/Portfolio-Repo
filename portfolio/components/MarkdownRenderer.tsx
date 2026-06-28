"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content into paragraphs or blocks by blank lines
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-foreground/90 leading-relaxed font-sans">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Headers (e.g., ## Title or ### Subtitle)
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold border-b border-surface-border pb-2 mt-8 mb-4 text-foreground flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-neon rounded-full inline-block" />
              {trimmed.substring(3).trim()}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-xl font-bold text-foreground mt-6 mb-3"
            >
              {trimmed.substring(4).trim()}
            </h3>
          );
        }

        // 2. Blockquotes (e.g., > Quote)
        if (trimmed.startsWith("> ")) {
          const quoteLines = trimmed
            .split("\n")
            .map((line) => line.trim().replace(/^>\s*/, ""))
            .filter(Boolean);

          return (
            <blockquote
              key={index}
              className="border-l-4 border-neon bg-surface/50 rounded-r-lg px-6 py-4 my-6 italic text-foreground/80 font-serif leading-relaxed relative overflow-hidden"
            >
              {quoteLines.map((line, lIdx) => (
                <p key={lIdx} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </blockquote>
          );
        }

        // 3. Lists (un-ordered lists)
        if (
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("✓ ")
        ) {
          const items = trimmed.split("\n").map((line) => line.trim());

          return (
            <ul key={index} className="space-y-3 pl-2 my-4">
              {items.map((item, itemIdx) => {
                let text = item;
                let isCheck = false;

                if (item.startsWith("✓ ")) {
                  text = item.substring(2);
                  isCheck = true;
                } else if (item.startsWith("- ")) {
                  text = item.substring(2);
                } else if (item.startsWith("* ")) {
                  text = item.substring(2);
                }

                // Inline bold formatting check (e.g. **text**)
                const formattedText = parseInlineFormatting(text);

                return (
                  <li key={itemIdx} className="flex items-start gap-3">
                    {isCheck ? (
                      <span className="text-neon flex-shrink-0 mt-1 select-none">✓</span>
                    ) : (
                      <span className="text-neon flex-shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-neon/80" />
                    )}
                    <span className="text-foreground/90">{formattedText}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Image Block Check
        const imgMatch = trimmed.match(/^\!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          return (
            <div key={index} className="my-6">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="w-full rounded-2xl border border-surface-border object-cover shadow-lg max-h-[420px] bg-surface/50"
              />
              {imgMatch[1] && (
                <p className="text-center text-xs text-text-muted mt-2 font-medium">
                  {imgMatch[1]}
                </p>
              )}
            </div>
          );
        }

        // 4. Horizontal Rule
        if (trimmed === "---") {
          return <hr key={index} className="border-t border-surface-border my-8" />;
        }

        // 5. Default: Paragraph
        return (
          <p key={index} className="text-base text-foreground/85 leading-relaxed">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Simple parser for inline formatting (e.g. **bold**, [text](url), ![alt](url))
function parseInlineFormatting(text: string): React.ReactNode[] {
  // Regex to split on images, links, or bold marks
  const regex = /(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // 1. Image match (![alt](url))
    const imgMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const label = imgMatch[1];
      const url = imgMatch[2];
      return (
        <span key={index} className="block my-6">
          <img
            src={url}
            alt={label}
            className="w-full rounded-2xl border border-surface-border object-cover shadow-lg max-h-[420px] bg-surface/50"
          />
          {label && (
            <span className="block text-center text-xs text-text-muted mt-2 font-medium">
              {label}
            </span>
          )}
        </span>
      );
    }

    // 2. Bold match (**text**)
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 3. Link match ([text](url))
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      
      const isAnchor = url.startsWith("#");
      return (
        <a
          key={index}
          href={url}
          target={isAnchor ? "_self" : "_blank"}
          rel={isAnchor ? "" : "noopener noreferrer"}
          className="text-neon hover:underline font-medium transition-colors"
        >
          {label}
        </a>
      );
    }

    // 4. Regular text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
