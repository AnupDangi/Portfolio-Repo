"use client";
import { useState } from "react";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="md:hidden p-2 rounded focus:outline-none text-white hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <a href="#about" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <img src="/icon.png" alt="Anup Dangi" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              <span className="text-lg sm:text-xl font-semibold text-white">Anup Dangi</span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="text-gray-300 hover:text-white hover:underline transition-colors">
              about
            </a>
            <a href="#projects" className="text-gray-300 hover:text-white hover:underline transition-colors">
              projects
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white hover:underline transition-colors">
              contact
            </a>
          </nav>
        </div>
        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0a0a0a]">
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-3">
              <a 
                href="#about" 
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                about
              </a>
              <a 
                href="#projects" 
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                projects
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileOpen(false)}
                className="text-gray-300 hover:text-white hover:underline transition-colors"
              >
                contact
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero / About */}
        <section id="about" className="py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">Anup Dangi</h1>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-300">
                <p>
                  <span className="font-semibold text-white">Introduction:</span> I am a
                  full stack AI Engineer and I love to build products which help
                  human lives
                </p>
                <p>
                  <span className="font-semibold text-white">Education:</span> 4th Year BE
                  AIML, CMRIT College of Engineering, Bengaluru, India
                </p>
                <p>
                  <span className="font-semibold text-white">Currently Learning:</span> DL, RL, LLMS
                  Core and GenAI and building full stack applications
                </p>
                <p>
                  <span className="font-semibold text-white">
                    Experience (April-October 2025):
                  </span>{" "}
                  Engineering Intern at Areta360 Technologies Private Limited, Bengaluru,
                  India. Worked on Diffusion Models, Virtual Try on
                  Applications, Writing LLM Agents using Google ADK.Implemented
                  human in the loop to check and validate the human response and
                  drive the flow of execution. Designed Database Schemas and used
                  indexes for faster retrieval and many more.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-base sm:text-lg">
                  <span className="font-semibold text-white">Email:</span>{" "}
                  <a
                    href="mailto:anupdangi1589@gmail.com"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    anupdangi1589@gmail.com
                  </a>
                </p>
                <p className="text-base sm:text-lg">
                  <span className="font-semibold text-white">Phone:</span>{" "}
                  <a
                    href="tel:+918951271598"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    +91 8951271598
                  </a>
                </p>
                <p className="text-base sm:text-lg">
                  <span className="font-semibold text-white">CV:</span>{" "}
                  <a
                    href="/RESUME_ANUPP.pdf"
                    target="_blank"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    View
                  </a>
                </p>
              </div>

              <p className="text-base sm:text-lg leading-relaxed pt-4 text-gray-300 italic">
                I am interested in real life challenging problems.I love to do
                work which I like and find challenging
              </p>
            </div>

            <aside className="w-full lg:w-auto shrink-0 pt-2 flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  src="/newpp.jpeg"    
                  alt="profile"
                  width={500}
                  height={500}
                  className="rounded-full object-cover w-full max-w-[280px] sm:max-w-[300px] shadow-2xl ring-2 ring-gray-800"
                />
              </div>
            </aside>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-12 sm:py-16 border-t border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Projects</h2>
          <div className="space-y-3">
            <ul className="list-disc list-inside space-y-3 sm:space-y-4 ml-2 sm:ml-4 text-base sm:text-lg leading-relaxed text-gray-300">
              <li>
                Internship Project: Talk with your data in Natural Language and
                generate intutive charts:{" "}
                <a
                  href="https://nora.areta360.com/"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Nora
                </a>
              </li>
              <li>
                A Trading Platform:{" "}
                <a
                  href="https://zerodha-clone-ykwn.vercel.app/"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Zerodha Clone
                </a>
              </li>
              <li>
                A Student Safety Tracker:{" "}
                <a
                  href="https://github.com/AnupDangi/StudentSafetyTracking_5thSem.git"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Student Safety Tracker
                </a>
              </li>
              <li>
                Multi-Modal RAG using local LLM for SIH:{" "}
                <a
                  href="https://github.com/AnupDangi/SIH25231-Multi-Modal-RAG"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Youtube Link
                </a>{" "}
                <a
                  href="https://github.com/AnupDangi/SIH25231-Multi-Modal-RAG"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Github Link
                </a>
              </li>
              <li>
                (Ongoing) My First AI Product:AI Powered Collaborative Platform
                will be launched soon stayed tuned:{" "}
                <a
                  href="https://aicolearn.live"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  AICOLEARN
                </a>
              </li>
              <li>
                Ongoing Project: Desktop AI Assistant: {" "}
                <a
                  href="https://newyantra.vercel.app/"
                  target="_blank"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  NewYantra
                </a>
              </li>
            </ul>
            <p className="text-base sm:text-lg mt-4 text-gray-400">
              Worked on many other projects, check my github for more details
            </p>
          </div>
        </section>

        {/* Contact / Social Links */}
        <section id="contact" className="py-12 sm:py-16 border-t border-gray-800">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Contact & Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <a
              href="https://www.linkedin.com/in/anup-dangi/"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">LinkedIn</span>
            </a>
            <a
              href="https://www.facebook.com/Anup.Dangi111"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/anupdangi22/"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Instagram</span>
            </a>
            <a
              href="https://medium.com/@anupdangi1589"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-2.62 6.5-6.04 7.05a4.69 4.69 0 001.32-2.72 4.4 4.4 0 01-2.25.62 4.5 4.5 0 01-4.5-4.5 4.5 4.5 0 014.5-4.5c1.16 0 2.23.4 3.07 1.08a4.61 4.61 0 013.83-1.98c.05 0 .1 0 .15.02a6.78 6.78 0 00-2.22-3.6 6.8 6.8 0 00-9.3 9.25 6.8 6.8 0 0011.25 6.33c.4-.36.76-.76 1.08-1.18.32-.05.64-.08.98-.08 3.54 0 6.5-2.61 7.05-6.04a7.02 7.02 0 00.02-.95z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Medium</span>
            </a>
            <a
              href="https://www.kaggle.com/anupdangi339"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.234 0 .351.118.246.353l-6.955 8.748 6.955 8.748c.105.234-.012.352-.246.352z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">Kaggle</span>
            </a>
            <a
              href="https://github.com/AnupDangi"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-cyan-500/50 transition-all group"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-gray-300 group-hover:text-white transition-colors">GitHub</span>
            </a>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-sm text-gray-500 text-center">
          © Copyright {new Date().getFullYear()} Anup Dangi
        </div>
      </footer>
    </main>
  );
}
