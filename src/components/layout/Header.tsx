import React from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';

export function Header() {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-6 shadow-md border-b-4 border-b-primary/90">
      <div className="max-w-6xl mx-auto flex items-center justify-start gap-6">
        <div className="flex-shrink-0">
          <Image
            src={logo}
            alt="KMCT College of Pharmacy Logo"
            height={60}
            priority
            className="object-contain"
          />
        </div>
        <div className="flex flex-col border-l-2 border-primary-foreground/30 pl-6 py-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            KMCT College of Pharmacy
          </h1>
          <p className="text-sm md:text-base text-primary-foreground/80 mt-1">
            Application for Admission to M.Pharm / Pharm.D (P.B.) | 2026-27
          </p>
        </div>
      </div>
    </header>
  );
}
