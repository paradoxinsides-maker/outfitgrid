import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, LogIn, LogOut, Plus, Trash2, 
  Edit, ArrowRight, Settings, Image as ImageIcon, Grid, X 
} from "lucide-react";

// Types Define
interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  brand: string;
  description: string;
}

interface SiteSettings {
  announcement: string;
  heroTitle: string;
  heroSub: string;
  heroImage: string;
}

// Initial Dummy Data (Agar database khali ho toh dikhane ke liye)
const initialProducts: Product[] = [
  { id: "1", name: "Premium Luxury Printed Casual Shirt", price: "1899", category: "Men", brand: "RARE RABBIT", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60", description: "Luxury tailored soft cotton casual shirt." },
  { id: "2", name: "Aesthetic Oversized Drop-Shoulder Shirt", price: "1499", category: "Men", brand: "SNITCH", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=60", description: "Comfortable drop-shoulder oversized streetwear fit." },
  { id: "3", name: "Floral Summer Maxi Dress", price: "2499", category: "Women", brand: "ZARA", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=60", description: "Lightweight floral maxi dress for daily wear." },
  { id: "4", name: "Leather Tote Handbag", price: "3999", category: "Bag", brand: "H&M", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60", description: "Spacious premium finish leather tote bag." }
];

const defaultSettings: SiteSettings = {
  announcement: "Free shipping on orders above ₹999",
  heroTitle: "New Collection Is Here",
  heroSub: "Trendy outfits up to 50% off. Shop the latest styles now.",
  heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
};

export default function App() {
  // States
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem("og_products");
    return local ? JSON.parse(local) : initialProducts;
  });
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const local = localStorage.getItem("og_settings");
    return local ? JSON.parse(local) : defaultSettings;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Panel Forms State
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Men", brand: "", image: "", description: "" });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("og_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("og_settings", JSON.stringify(settings));
  }, [settings]);

  // Categories list
  const categories = ["ALL", "HOME", "SHOP", "MEN", "WOMEN", "BAG", "BEAUTY", "MAKEUP", "ACCESSORIES", "FOOTWEAR", "SALE"];

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category.toUpperCase() === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123") { // 🔑 AAPKA ADMIN PASSWORD
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput("");
      setLoginError("");
    } else {
      setLoginError("Galat Password! Dubara try karein.");
    }
  };

  // Add Product
  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return;
    const productToAdd: Product = {
      id: Date.now().toString(),
      ...newProduct
    };
    setProducts([productToAdd, ...products]);
    setNewProduct({ name: "", price: "", category: "Men", brand: "", image: "", description: "" });
  };

  // Delete Product
  const deleteProduct = (id: string) => {
    if(confirm("Kya aap sach me is product ko delete karna chahte hain?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased font-sans">
      
      {/* 🖤 TOP ANNOUNCEMENT BAR */}
      <div className="bg-black text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        {settings.announcement}
      </div>

      {/* 🤍 MAIN PREMIUM HEADER */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-sm px-4 lg:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory("ALL")}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-sm tracking-tighter">OG</div>
          <span className="text-xl font-black tracking-widest text-black">OUTFIT GRID</span>
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative w-full max-w-lg mx-6 hidden md:block">
          <Search className="absolute left-4 top-3 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Product search karein..."
            className="w-full bg-slate-50 border border-slate-200/80 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button 
              onClick={() => setIsAdmin(false)} 
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-3 py-2 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Admin
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)} 
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-black transition"
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
          )}
          <div className="relative p-2 text-black cursor-pointer hover:opacity-70 transition">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>
      </header>

      {/* 🗂️ CLEAN SLIDER-STYLE CATEGORY CHIPS */}
      <div className="border-b border-slate-100 bg-white px-4 lg:px-12 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-black text-white shadow-sm"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 👑 FULL ACCESS WORDPRESS-STYLE ADMIN PANEL CONTAINER */}
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-slate-900 text-white p-6 lg:px-12 border-b-4 border-yellow-500 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Section 1: Customize Text and Visuals */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
            <h2 className="text-sm font-black uppercase tracking-widest text-yellow-400 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> 1. Customize UI & Text
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Announcement Banner Text:</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-yellow-400"
                  value={settings.announcement}
                  onChange={(e) => setSettings({...settings, announcement: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Hero Big Heading:</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-yellow-400"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Hero Subtitle Discription:</label>
                <textarea 
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-yellow-400"
                  value={settings.heroSub}
                  onChange={(e) => setSettings({...settings, heroSub: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Hero Banner Image URL:</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:outline-none focus:border-yellow-400"
                  value={settings.heroImage}
                  onChange={(e) => setSettings({...settings, heroImage: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Add New Products Form */}
          <form onSubmit={addProduct} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-yellow-400 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" /> 2. Upload New Outfits (Add Product)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <input 
                type="text" placeholder="Product Name (e.g. Oversized Drop-Shoulder Shirt)" required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white"
                value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
              <input 
                type="number" placeholder="Price in ₹ (e.g. 1499)" required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white"
                value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
              <input 
                type="text" placeholder="Brand Label (e.g. SNITCH, ZARA)" required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white"
                value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
              />
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white font-medium"
                value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                {categories.filter(c => c !== "ALL" && c !== "SHOP" && c !== "HOME").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="md:col-span-2">
                <input 
                  type="text" placeholder="Direct Image URL Link (Unsplash, ImgBB link etc.)" required
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white"
                  value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <textarea 
                  placeholder="Short Description about fabric, fitting and material..." rows={2}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white"
                  value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2.5 rounded-xl uppercase text-xs tracking-wider transition">
              Publish Live on Website
            </button>
          </form>
        </motion.div>
      )}

      {/* 🖼️ EXACT SCREENSHOT STYLE HERO SLIDER BANNER */}
      <div className="px-4 lg:px-12 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-slate-100 h-[320px] md:h-[420px] flex items-center">
          {/* Background image overlay */}
          <img 
            src={settings.heroImage} 
            alt="New Drop Banner" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          
          {/* Banner Text Content */}
          <div className="relative z-10 text-white pl-8 md:pl-16 max-w-xl">
            <motion.h1 
              key={settings.heroTitle}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              {settings.heroTitle}
            </motion.h1>
            <p className="text-slate-200 text-sm md:text-base mt-3 font-medium leading-relaxed">
              {settings.heroSub}
            </p>
            <button className="mt-6 bg-white text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-md group">
              Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 🛍️ PRODUCT HEADLINE AREA */}
      <div className="px-4 lg:px-12 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-900">
          <Grid className="w-5 h-5 text-slate-400" /> All Products
        </h2>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredProducts.length} Items</span>
      </div>

      {/* 👕 EXACT SCREENSHOT STYLE CATALOG GRID */}
      <main className="px-4 lg:px-12 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-3xl border-slate-200">
            <p className="text-slate-400 font-medium">No items found matching your filter selections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={product.id}
                  className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden"
                >
                  {/* Photo Container with Hover Scale */}
                  <div className="relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Brand Tag Top-Left */}
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm font-black text-[9px] uppercase tracking-widest text-slate-900 px-2.5 py-1 rounded-md">
                      {product.brand}
                    </span>

                    {/* Admin Actions Overlay on Card */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-1 z-20">
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition"
                          title="Delete Outfit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Details Text Block */}
                  <div className="pt-3 pb-1 px-1 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-black transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">{product.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-sm md:text-base font-black text-black">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* 🔐 MODERN SECURE LOGIN MODAL POP-UP */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100"
            >
              <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-black transition">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-black mb-3"><Settings className="w-6 h-6" /></div>
                <h3 className="text-lg font-black tracking-tight">OUTFIT GRID CMS ADMIN</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Bina kisi code ke apni website full access karein.</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Enter Secret Code / Password:</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black focus:bg-white"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                  {loginError && <p className="text-red-500 text-xs mt-1 font-semibold">{loginError}</p>}
                </div>
                <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-900 transition">
                  Unlock WordPress Admin Panel
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}