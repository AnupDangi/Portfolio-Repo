import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anup Dangi - Full Stack Developer & AI Engineer",
  description: "Full Stack Developer and AI Engineer specializing in modern web applications, machine learning, and innovative solutions. Explore my portfolio and projects.",
  keywords: ["Anup Dangi", "Full Stack Developer", "AI Engineer", "Web Developer", "Portfolio", "Nepal"],
  authors: [{ name: "Anup Dangi" }],
  creator: "Anup Dangi",
  metadataBase: new URL("https://anupdangi.com.np"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anupdangi.com.np",
    siteName: "Anup Dangi Portfolio",
    title: "Anup Dangi - Full Stack Developer & AI Engineer",
    description: "Full Stack Developer and AI Engineer specializing in modern web applications, machine learning, and innovative solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anup Dangi Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anup Dangi - Full Stack Developer & AI Engineer",
    description: "Full Stack Developer and AI Engineer specializing in modern web applications, machine learning, and innovative solutions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "VyxgKl-6MA0FinccEbTP1l-dgzh-uXjQ_u6jeU40e0c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
