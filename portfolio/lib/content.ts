import fs from 'fs';
import path from 'path';

export interface Book {
  slug: string;
  title: string;
  author: string;
  status: string;
  rating: number;
  dateRead: string;
  readTime: string;
  listeningTime: string;
  color: string;
  spineColor: string;
  textColor: string;
  coverImage?: string;
  content: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  listeningTime: string;
  coverImage: string;
  tags: string[];
  content: string;
}

// Simple manual frontmatter and body parser
function parseMarkdown(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: fileContent };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const metadata: Record<string, string> = {};

  yamlBlock.split('\n').forEach((line) => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim().replace(/^['"]|['"]$/g, '');
      metadata[key] = value;
    }
  });

  return { metadata, content: content.trim() };
}

export function getBooks(): Book[] {
  const booksDirectory = path.join(process.cwd(), 'content/books');
  if (!fs.existsSync(booksDirectory)) return [];

  const filenames = fs.readdirSync(booksDirectory);
  const books = filenames
    .filter((name) => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const book = getBookBySlug(slug);
      return book;
    })
    .filter((book): book is Book => book !== null);

  // Custom sort: Zero to One first, then DDIA, then Mom Test
  const orderMap: Record<string, number> = {
    'zero-to-one': 1,
    'designing-data-intensive-applications': 2,
    'the-mom-test': 3,
  };

  return books.sort((a, b) => (orderMap[a.slug] || 99) - (orderMap[b.slug] || 99));
}

export function getBookBySlug(slug: string): Book | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/books', `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parseMarkdown(fileContents);

    return {
      slug,
      title: metadata.title || '',
      author: metadata.author || '',
      status: metadata.status || '',
      rating: parseInt(metadata.rating) || 5,
      dateRead: metadata.dateRead || '',
      readTime: metadata.readTime || '',
      listeningTime: metadata.listeningTime || '',
      color: metadata.color || '#0f172a',
      spineColor: metadata.spineColor || metadata.color || '#1e293b',
      textColor: metadata.textColor || '#18D26E',
      coverImage: metadata.coverImage || '',
      content,
    };
  } catch (error) {
    console.error(`Error parsing book with slug ${slug}:`, error);
    return null;
  }
}

export function getArticles(): Article[] {
  const writingDirectory = path.join(process.cwd(), 'content/writing');
  if (!fs.existsSync(writingDirectory)) return [];

  const filenames = fs.readdirSync(writingDirectory);
  const articles = filenames
    .filter((name) => name.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      return getArticleBySlug(slug);
    })
    .filter((article): article is Article => article !== null);

  // Sort by date or slug order
  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(process.cwd(), 'content/writing', `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parseMarkdown(fileContents);

    const tags = metadata.tags
      ? metadata.tags
          .replace(/[\[\]]/g, '')
          .split(',')
          .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
      : [];

    return {
      slug,
      title: metadata.title || '',
      description: metadata.description || '',
      date: metadata.date || '',
      readTime: metadata.readTime || '',
      listeningTime: metadata.listeningTime || '',
      coverImage: metadata.coverImage || '',
      tags,
      content,
    };
  } catch (error) {
    console.error(`Error parsing article with slug ${slug}:`, error);
    return null;
  }
}
