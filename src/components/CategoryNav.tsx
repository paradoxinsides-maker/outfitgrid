import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' });
  };

  const allItems = [{ id: 'all', name: 'ALL' }, ...categories];

  return (
    <div className="relative bg-white border-b border-slate-100">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white via-white to-transparent text-slate-400 hover:text-slate-700 hidden sm:block"
      >
        <ChevronLeft size={20} />
      </button>
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allItems.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white via-white to-transparent text-slate-400 hover:text-slate-700 hidden sm:block"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
