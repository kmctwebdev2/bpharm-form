import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FILE_LIMITS } from '@/features/application/constants/file-limits';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[90vh] font-sans bg-white relative overflow-hidden selection:bg-primary/20">
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12 text-center">
        {/* Hero Content */}
        <div className="max-w-2xl space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Application Portal
            <span className="block text-primary mt-2">2026 Admissions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Complete your B.Pharm or Pharm D application securely in minutes.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href="/apply">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Application
            </Button>
          </Link>
        </div>

        {/* Minimal Requirements Info */}
        <div className="mt-16 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span>5 quick steps</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span>Images under {FILE_LIMITS.IMAGE_MAX_SIZE / (1024 * 1024)}MB</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span>PDFs under {FILE_LIMITS.SSLC_MAX_SIZE / (1024 * 1024)}MB</span>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground/60 relative z-10">
        <p>&copy; {new Date().getFullYear()} KMCT Group of Institutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
