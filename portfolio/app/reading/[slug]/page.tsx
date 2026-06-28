import React from "react";
import { getBookBySlug, getBooks } from "../../../lib/content";
import BookDetailView from "../../../components/BookDetailView";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FramerBackground from "../../../components/FramerBackground";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const books = getBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  
  if (!book) return { title: "Book Not Found" };

  return {
    title: `${book.title} | Anup Dangi Reading Reflection`,
    description: `Read my direct, unfiltered notes and review of ${book.title} by ${book.author} and listen to my audio reflections.`,
    openGraph: {
      title: `${book.title} | Anup Dangi`,
      description: `My review and thoughts on ${book.title} by ${book.author}.`,
      type: "article",
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen text-foreground relative z-0 selection:bg-neon selection:text-black">
      <FramerBackground />
      <Navbar />
      <BookDetailView book={book} />
      <Footer />
    </main>
  );
}
