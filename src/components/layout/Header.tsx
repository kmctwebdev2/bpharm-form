import React from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';

export function Header() {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-6 shadow-md border-b-4 border-b-primary/90">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 sm:gap-6 text-center sm:text-left">
        <div className="flex-shrink-0">
          <Image
            src={logo}
            alt="KMCT College of Pharmacy Logo"
            height={60}
            priority
            className="object-contain"
          />
        </div>
        <div className="flex flex-col sm:border-l-2 border-primary-foreground/30 sm:pl-6 py-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            KMCT College of Pharmacy
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80 mt-1">
            Application for Admission to M.Pharm / Pharm.D (P.B.) | 2026-27
          </p>
        </div>
      </div>
    </header>
  );
}
