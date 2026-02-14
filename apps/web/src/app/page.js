import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-dark flex flex-col items-center justify-center p-8 font-sans">
      <main className="flex flex-col items-center gap-8 text-center animate-in fade-in duration-700">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-wood tracking-tight">
            Cafe Chaska
          </h1>
          <p className="text-xl text-dark/80 max-w-md mx-auto font-light">
            Minimalist Cafe Management for the Modern Era.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-wood text-cream rounded-full hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            Login
          </Link>
          <Link
            href="/demo"
            className="px-8 py-3 border border-wood text-wood rounded-full hover:bg-wood/10 transition-all active:scale-95"
          >
            Book a Demo
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-sm text-wood/60">
        &copy; 2026 Cafe Chaska System
      </footer>
    </div>
  );
}
