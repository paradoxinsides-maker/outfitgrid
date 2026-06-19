import { ArrowRight } from 'lucide-react';
import type { SiteConfig } from '../types';

interface HeroBannerProps {
  config: SiteConfig;
}

export default function HeroBanner({ config }: HeroBannerProps) {
  return (
    <section className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden rounded-none sm:rounded-b-3xl">
      <img
        src={config.bannerImage}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-10 max-w-5xl mx-auto">
        <h2 className="text-white text-2xl sm:text-4xl font-extrabold leading-tight max-w-md drop-shadow-lg">
          {config.bannerHeading}
        </h2>
        <p className="text-white/90 text-sm sm:text-base mt-2 max-w-sm drop-shadow">
          {config.bannerSubheading}
        </p>
        <a
          href={config.bannerButtonLink}
          className="mt-4 inline-flex items-center gap-2 self-start px-5 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-indigo-50 transition-colors"
        >
          {config.bannerButtonText}
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}
