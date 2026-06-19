import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import CustomerAuthModal from '../components/CustomerAuthModal';
import {
  searchProducts,
  getCategories,
  getConfig,
  getLoggedInCustomer,
  fetchProductsFromSheet,
} from '../lib/store';
import type { SiteConfig, Category, CustomerLead, Product } from '../types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [accountOpen, setAccountOpen] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(getConfig());
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [customer, setCustomer] = useState<CustomerLead | null>(null);
  const [sheetProducts, setSheetProducts] = useState<Product[] | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState('');

  useEffect(() => {
    setCustomer(getLoggedInCustomer());
    const onStorage = () => {
      setConfig(getConfig());
      setCategories(getCategories());
      setCustomer(getLoggedInCustomer());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (config.productSheetUrl.trim()) {
      setSheetLoading(true);
      setSheetError('');
      fetchProductsFromSheet(config.productSheetUrl)
        .then((data) => {
          setSheetProducts(data);
        })
        .catch((err) => {
          setSheetError('Google Sheet se data load nahi hua. URL check karein.');
          setSheetProducts(null);
        })
        .finally(() => setSheetLoading(false));
    } else {
      setSheetProducts(null);
    }
  }, [config.productSheetUrl]);

  const products = useMemo(() => {
    const baseList = sheetProducts ?? searchProducts('', activeCategory);
    const q = searchQuery.toLowerCase().trim();
    let list = baseList;
    if (activeCategory && activeCategory !== 'all' && activeCategory !== 'home' && activeCategory !== 'shop') {
      list = list.filter((p) => p.categoryId === activeCategory);
    }
    if (!q) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery, activeCategory, sheetProducts]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        config={config}
        onAccountClick={() => setAccountOpen(true)}
      />

      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <HeroBanner config={config} />

      <main className="max-w-5xl mx-auto px-4 py-5 pb-24" id="products">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {activeCategory === 'all'
              ? 'All Products'
              : categories.find((c) => c.id === activeCategory)?.name || 'Products'}
          </h2>
          <span className="text-xs text-slate-500">{products.length} items</span>
        </div>

        {sheetLoading && (
          <div className="text-center py-10 text-sm text-slate-500">Products load ho rahe hain...</div>
        )}

        {sheetError && !sheetLoading && (
          <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded-xl mb-4">{sheetError}</div>
        )}

        {!sheetLoading && products.length === 0 ? (
          <EmptyState query={searchQuery} />
        ) : (
          !sheetLoading && (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          )
        )}
      </main>

      <footer className="border-t border-slate-100 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-800">{config.brandName}</p>
          <p className="text-xs text-slate-500 mt-1">{config.footerText}</p>
          <p className="text-xs text-slate-400 mt-1">{config.footerContact}</p>
          <p className="text-[10px] text-slate-300 mt-3">
            © {new Date().getFullYear()} {config.brandName}. All rights reserved.
          </p>
        </div>
      </footer>

      <CustomerAuthModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onAuthSuccess={() => setCustomer(getLoggedInCustomer())}
      />
    </div>
  );
}
