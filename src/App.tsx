import { useEffect, useState } from "react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Filter, RefreshCw, Layers } from "lucide-react";

// 🛍️ APNI GOOGLE SHEET KA PUBLISHED CSV URL YAHAN PASTE KAREIN
const SHEET_CSV_URL = "APNA_GOOGLE_SHEET_CSV_URL_YAHAN_PASTE_KAREIN";

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description?: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  // 🔄 Google Sheet se Live Data Fetch karne ka function
  const fetchSheetData = () => {
    setLoading(true);
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        // Khali ya invalid rows ko filter out karein
        const validProducts = (results.data as Product[]).filter(
          (p) => p.name && p.price && p.image
        );
        
        setProducts(validProducts);
        setFilteredProducts(validProducts);

        // Categories automatic nikalne ke liye
        const allCats = validProducts.map((p) => p.category.trim());
        const uniqueCats = ["All", ...Array.from(new Set(allCats))];
        setCategories(uniqueCats);
        
        setLoading(false);
      },
      error: (err) => {
        console.error("Sheet fetch error:", err);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  // 🔍 Search aur Category Filter ka logic
  useEffect(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category.trim() === selectedCategory);
    }

    if (search.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 🌟 PREMIUM NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="text-black w-6 h-6 stroke-[2.5]" />
          <span className="text-xl font-black tracking-widest text-black">OUTFIT GRID</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search premium outfits..."
            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right Nav Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchSheetData} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
            title="Refresh Database"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative p-2 hover:bg-slate-100 rounded-full text-black transition cursor-pointer">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE SEARCH BAR */}
      <div className="p-4 md:hidden bg-white border-b border-slate-200">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search premium outfits..."
            className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 👕 HERO BANNER */}
      <div className="bg-black text-white py-12 px-6 text-center shadow-inner">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter"
        >
          CURATED STREETWEAR
        </motion.h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 tracking-wide font-medium">
          LIVE DATABASE INTEGRATION • FRESH DROP EVERY MINUTE
        </p>
      </div>

      {/* 🎛️ CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto px-6 py-4 scrollbar-none bg-white border-b border-slate-200">
        <Filter className="text-slate-400 w-4 h-4 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-black text-white shadow-md scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 📦 PRODUCT GRID SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
            <p className="text-slate-500 font-medium text-sm">Syncing with Google Sheets...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg font-medium">No items found matching your filter.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id || product.name}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Wrapper */}
                  <div className="relative bg-slate-100 aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-base md:text-lg font-black text-black">
                        ₹{product.price}
                      </span>
                      <button className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm active:scale-95">
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}