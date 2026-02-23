export default function Footer() {
    return (
        <footer className="border-t border-white/10 mt-12 bg-black/50 backdrop-blur-sm relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-500 text-center">
                © Copyright {new Date().getFullYear()} Anup Dangi. All rights reserved.
            </div>
        </footer>
    );
}
