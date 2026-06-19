import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="aspect-[3/4] bg-slate-100 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTRiYTNiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
          }}
        />
        {product.tag && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold text-slate-800 uppercase tracking-wide shadow-sm">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
          {product.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="text-sm sm:text-base font-bold text-rose-600">
            {formatPrice(product.price)}
          </span>
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 text-white text-[10px] sm:text-xs font-medium rounded-lg hover:bg-slate-800 active:scale-95 transition-all"
          >
            Buy Now
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
