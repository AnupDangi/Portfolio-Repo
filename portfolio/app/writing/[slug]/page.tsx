import React from "react";
import { getArticleBySlug, getArticles } from "../../../lib/content";
import ArticleDetailView from "../../../components/ArticleDetailView";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FramerBackground from "../../../components/FramerBackground";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Anup Dangi Technical Writing`,
    description: article.description,
    openGraph: {
      title: `${article.title} | Anup Dangi`,
      description: article.description,
      type: "article",
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen text-foreground relative z-0 selection:bg-neon selection:text-black">
      <FramerBackground />
      <Navbar />
      <ArticleDetailView article={article} />
      <Footer />
    </main>
  );
}
