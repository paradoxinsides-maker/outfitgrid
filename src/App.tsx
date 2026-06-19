import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, LogIn, LogOut, Plus, Trash2, Edit, ArrowRight, 
  Settings, Image as ImageIcon, Grid, X, Star, MessageSquare, Menu, 
  CreditCard, Layout, Eye, CheckCircle, Smartphone, PlusCircle
} from "lucide-react";

// ==========================================
// 📊 TYPE DEFINITIONS
// ==========================================
interface Product {
  id: string; name: string; price: number; category: string; 
  brand: string; image: string; description: string; rating: number;
}
interface Banner { id: string; title: string; subtitle: string; image: string; }
interface Review { id: string; name: string; text: string; rating: number; date: string; }
interface MenuItem { id: string; name: string; link: string; }
interface CustomPage { id: string; title: string; slug: string; content: string; type: "custom" | "system"; }
interface PaymentMethod { id: string; name: string; details: string; active: boolean; }

// ==========================================
// 📦 INITIAL DATA
// ==========================================
const initProducts: Product[] = [
  { id: "1", name: "Premium Luxury Casual Shirt", price: 1899, category: "MEN", brand: "RARE RABBIT", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", description: "Luxury cotton shirt.", rating: 5 },
  { id: "2", name: "Oversized Drop-Shoulder Shirt", price: 1499, category: "MEN", brand: "SNITCH", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500", description: "Streetwear fit.", rating: 4 }
];
const initBanners: Banner[] = [
  { id: "b1", title: "NEW CURATED DROP", subtitle: "Trendy outfits up to 50% off", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" }
];
const initMenus: MenuItem[] = [
  { id: "m1", name: "HOME", link: "/" },
  { id: "m2", name: "SHOP", link: "/shop" },
  { id: "m3", name: "MEN", link: "/category/MEN" }
];
const initReviews: Review[] = [
  { id: "r1", name: "Rahul Sharma", text: "Amazing fabric quality! Highly recommended.", rating: 5, date: "19 June 2026" }
];
const initPages: CustomPage[] = [
  { id: "p1", title: "Home", slug: "", content: "Home Page Content", type: "system" },
  { id: "p2", title: "Shop All", slug: "shop", content: "Shop Catalog", type: "system" },
  { id: "p3", title: "Checkout", slug: "checkout", content: "Secure Checkout", type: "system" },
  { id: "p4", title: "Order Confirmed", slug: "order-success", content: "Thank You", type: "system" }
];
const initPayments: PaymentMethod[] = [
  { id: "pay1", name: "UPI (Google Pay / PhonePe)", details: "8888888888@ybl", active: true },
  { id: "pay2", name: "Cash On Delivery (COD)", details: "Pay at your door", active: true }
];

// ==========================================
// ⚙️ MAIN APP WITH ROUTING
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER VIEWS */}
        <Route path="/*" element={<CustomerLayout />} />
        
        {/* 🔐 EXCLUSIVE UNLIMITED ADMIN URL */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

// ==========================================
// 🛒 CUSTOMER INTERFACE & PAGES
// ==========================================
function CustomerLayout() {
  const [logo, setLogo] = useState(() => localStorage.getItem("og_logo") || "OUTFIT GRID");
  const [menus] = useState<MenuItem[]>(() => JSON.parse(localStorage.getItem("og_menus") || JSON.stringify(initMenus)));
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Dynamic Announcement */}
      <div className="bg-black text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
        {localStorage.getItem("og_announcement") || "Free shipping on orders above ₹999"}
      </div>

      {/* Dynamic Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-sm px-4 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xs">OG</div>
          <span className="text-xl font-black tracking-widest text-black uppercase">{logo}</span>
        </Link>

        {/* Dynamic Header Menu System */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wider">
          {menus.map((m) => (
            <Link key={m.id} to={m.link} className="hover:text-amber-600 transition uppercase">{m.name}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="text-xs bg-slate-100 font-bold px-3 py-1.5 rounded-lg text-slate-700 hover:bg-black hover:text-white transition">Admin Panel</Link>
          <div className="relative p-2 text-black cursor-pointer" onClick={() => setCartCount(cartCount + 1)}>
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
          </div>
        </div>
      </header>

      {/* CUSTOMER SUB-ROUTES */}
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/page/:slug" element={<DynamicCustomPage />} />
      </Routes>
    </div>
  );
}

// 🏠 CUSTOMER HOME PAGE
function CustomerHome() {
  const [banners] = useState<Banner[]>(() => JSON.parse(localStorage.getItem("og_banners") || JSON.stringify(initBanners)));
  const [products] = useState<Product[]>(() => JSON.parse(localStorage.getItem("og_products") || JSON.stringify(initProducts)));
  const [reviews] = useState<Review[]>(() => JSON.parse(localStorage.getItem("og_reviews") || JSON.stringify(initReviews)));
  const navigate = useNavigate();

  return (
    <div>
      {/* Dynamic Hero Banners */}
      {banners.map((b) => (
        <div key={b.id} className="px-4 lg:px-12 py-6">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 h-[350px] flex items-center">
            <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover brightness-[0.8]" />
            <div className="relative z-10 text-white pl-8 md:pl-16 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">{b.title}</h1>
              <p className="text-slate-200 text-sm mt-2">{b.subtitle}</p>
              <button onClick={() => navigate("/shop")} className="mt-6 bg-white text-black font-bold text-xs uppercase px-6 py-3 rounded-full flex items-center gap-2 hover:bg-black hover:text-white transition shadow-md">Shop Collection <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      ))}

      {/* Products Grid */}
      <div className="px-4 lg:px-12 py-8">
        <h2 className="text-xl font-black mb-6">Latest Drops</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 p-2">
              <div className="relative aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden">
                <img src={p.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded text-[9px] font-black">{p.brand}</span>
              </div>
              <div className="p-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs md:text-sm line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-0.5 my-1 text-amber-500">
                    {Array.from({ length: p.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-black text-sm">₹{p.price}</span>
                  <button onClick={() => navigate("/checkout")} className="bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-slate-50 py-12 px-4 lg:px-12 mt-12">
        <h2 className="text-xl font-black mb-6 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-1 text-amber-500 mb-2">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic">"{r.text}"</p>
              <div className="mt-4 flex justify-between text-[10px] text-slate-400 font-bold">
                <span>- {r.name}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🛍️ SHOP CATALOG PAGE
function ShopPage() {
  const [products] = useState<Product[]>(() => JSON.parse(localStorage.getItem("og_products") || JSON.stringify(initProducts)));
  return (
    <div className="px-4 lg:px-12 py-10">
      <h1 className="text-2xl font-black mb-8">Shop All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border border-slate-100 rounded-2xl p-2">
            <img src={p.image} alt="" className="aspect-[3/4] object-cover rounded-xl w-full" />
            <h3 className="font-bold text-sm mt-2">{p.name}</h3>
            <p className="font-black text-sm mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 💳 SECURE CHECKOUT PAGE
function CheckoutPage() {
  const [payments] = useState<PaymentMethod[]>(() => JSON.parse(localStorage.getItem("og_payments") || JSON.stringify(initPayments)));
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto my-12 p-6 border rounded-3xl shadow-sm bg-white">
      <h2 className="text-xl font-black mb-4">Complete Order</h2>
      <div className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-2.5 border rounded-xl text-sm" required />
        <input type="text" placeholder="Delivery Address" className="w-full p-2.5 border rounded-xl text-sm" required />
        <input type="tel" placeholder="Phone Number" className="w-full p-2.5 border rounded-xl text-sm" required />
        
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mt-4">Select Payment Method</h3>
        {payments.filter(p => p.active).map(p => (
          <label key={p.id} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer bg-slate-50">
            <input type="radio" name="payment" defaultChecked />
            <div>
              <p className="text-sm font-bold">{p.name}</p>
              <p className="text-xs text-slate-500">{p.details}</p>
            </div>
          </label>
        ))}
        <button onClick={() => navigate("/order-success")} className="w-full bg-black text-white py-3 rounded-xl font-bold text-xs uppercase mt-4">Place Order (₹1499)</button>
      </div>
    </div>
  );
}

// 🎉 ORDER CONFIRMED PAGE
function OrderSuccessPage() {
  return (
    <div className="text-center py-24 max-w-sm mx-auto">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
      <h1 className="text-2xl font-black">Order Placed Successfully!</h1>
      <p className="text-sm text-slate-500 mt-2">Thank you for shopping. Your order tracking link will be sent shortly.</p>
      <Link to="/" className="inline-block mt-6 bg-black text-white text-xs font-bold uppercase px-6 py-3 rounded-full">Back to Home</Link>
    </div>
  );
}

// 📄 DYNAMIC PAGES RENDERER
function DynamicCustomPage() {
  const { slug } = useParams();
  const [pages] = useState<CustomPage[]>(() => JSON.parse(localStorage.getItem("og_pages") || JSON.stringify(initPages)));
  const page = pages.find(p => p.slug === slug);

  if (!page) return <div className="text-center py-20">Page Not Found</div>;
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-6">{page.title}</h1>
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{page.content}</div>
    </div>
  );
}


// ==========================================
// 👑 WORDPRESS-STYLE FULL ACCESS ADMIN PANEL
// ==========================================
function AdminDashboard() {
  // Sync States from DB
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem("og_products") || JSON.stringify(initProducts)));
  const [banners, setBanners] = useState<Banner[]>(() => JSON.parse(localStorage.getItem("og_banners") || JSON.stringify(initBanners)));
  const [menus, setMenus] = useState<MenuItem[]>(() => JSON.parse(localStorage.getItem("og_menus") || JSON.stringify(initMenus)));
  const [reviews, setReviews] = useState<Review[]>(() => JSON.parse(localStorage.getItem("og_reviews") || JSON.stringify(initReviews)));
  const [pages, setPages] = useState<CustomPage[]>(() => JSON.parse(localStorage.getItem("og_pages") || JSON.stringify(initPages)));
  const [payments, setPayments] = useState<PaymentMethod[]>(() => JSON.parse(localStorage.getItem("og_payments") || JSON.stringify(initPayments)));
  const [logo, setLogo] = useState(() => localStorage.getItem("og_logo") || "OUTFIT GRID");
  const [announcement, setAnnouncement] = useState(() => localStorage.getItem("og_announcement") || "Free shipping on orders above ₹999");

  // Local Sync
  useEffect(() => { localStorage.setItem("og_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("og_banners", JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem("og_menus", JSON.stringify(menus)); }, [menus]);
  useEffect(() => { localStorage.setItem("og_reviews", JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem("og_pages", JSON.stringify(pages)); }, [pages]);
  useEffect(() => { localStorage.setItem("og_payments", JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem("og_logo", logo); }, [logo]);
  useEffect(() => { localStorage.setItem("og_announcement", announcement); }, [announcement]);

  // Form states
  const [newProd, setNewProd] = useState({ name: "", price: "", category: "MEN", brand: "", image: "", description: "", rating: 5 });
  const [newBanner, setNewBanner] = useState({ title: "", subtitle: "", image: "" });
  const [newMenu, setNewMenu] = useState({ name: "", link: "/" });
  const [newRev, setNewRev] = useState({ name: "", text: "", rating: 5 });
  const [newPage, setNewPage] = useState({ title: "", slug: "", content: "" });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* SIDEBAR NAVIGATION CONTROL PANEL */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
            <Layout className="text-yellow-400 w-5 h-5" />
            <span className="text-md font-black tracking-wider text-white">CMS CORE ENGINE</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Unlimited Freedom</p>
          <div className="space-y-1 text-sm font-medium text-slate-400">
            <div className="p-2 bg-slate-800 text-white rounded-lg cursor-pointer flex items-center gap-2"><Grid className="w-4 h-4" /> Real-time Control</div>
            <Link to="/" className="p-2 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 mt-4"><Eye className="w-4 h-4" /> Live Store Dekhein</Link>
          </div>
        </div>
        <div className="text-center text-xs text-slate-600 font-bold">OUTFIT GRID V3.0 • LIVE BUILDER</div>
      </div>

      {/* MAIN BUILDER CONTROLS GRID */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-screen space-y-12">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Full-Access Control Panel</h1>
            <p className="text-xs text-slate-400 mt-1">Yahan se aap website ke pure sections, elements aur pages ko unlimted edit aur delete kar sakte hain.</p>
          </div>
        </div>

        {/* 🏢 SECTION: LOGO & IDENTITY */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Change Branding Logo Text:</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white" value={logo} onChange={(e) => setLogo(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Top Announcement Banner:</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} />
          </div>
        </div>

        {/* 🔗 SECTION: UNLIMITED HEADER MENU CONTROL */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><Menu className="w-4 h-4 text-cyan-400" /> Header Navbar Menus Control</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={(e) => { e.preventDefault(); setMenus([...menus, { id: Date.now().toString(), ...newMenu }]); setNewMenu({ name: "", link: "/" }); }} className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <input type="text" placeholder="Menu Name (e.g., WINTER)" className="w-full bg-slate-800 p-2.5 rounded-lg text-xs" value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} required />
              <input type="text" placeholder="Redirect Link (e.g., /shop)" className="w-full bg-slate-800 p-2.5 rounded-lg text-xs" value={newMenu.link} onChange={(e) => setNewMenu({ ...newMenu, link: e.target.value })} required />
              <button type="submit" className="w-full bg-cyan-600 py-2 rounded-lg text-xs font-bold">Add Menu Item</button>
            </form>
            <div className="lg:col-span-2 space-y-2">
              {menus.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-xs font-bold text-white">{m.name} <span className="text-slate-500 font-normal ml-2">({m.link})</span></span>
                  <button onClick={() => setMenus(menus.filter(x => x.id !== m.id))} className="text-red-400 p-1 hover:bg-slate-700 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 👕 SECTION: UNLIMITED PRODUCTS REPOSITORY */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><PlusCircle className="w-4 h-4 text-emerald-400" /> Add & Manage Catalog Products</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={(e) => { e.preventDefault(); setProducts([{ id: Date.now().toString(), price: Number(newProd.price), ...newProd }, ...products]); }} className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-xs">
              <input type="text" placeholder="Product Title" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} required />
              <input type="number" placeholder="Price (₹)" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newProd.price} onChange={(e) => setNewProd({...newProd, price: e.target.value})} required />
              <input type="text" placeholder="Brand / Label" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newProd.brand} onChange={(e) => setNewProd({...newProd, brand: e.target.value})} required />
              <input type="text" placeholder="Paste Direct Product Image URL Link" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newProd.image} onChange={(e) => setNewProd({...newProd, image: e.target.value})} required />
              <select className="w-full bg-slate-800 p-2.5 rounded-lg text-slate-300" value={newProd.category} onChange={(e) => setNewProd({...newProd, category: e.target.value})}>
                <option value="MEN">MEN</option><option value="WOMEN">WOMEN</option><option value="BAG">BAG</option>
              </select>
              <select className="w-full bg-slate-800 p-2.5 rounded-lg text-yellow-400" value={newProd.rating} onChange={(e) => setNewProd({...newProd, rating: Number(e.target.value)})}>
                <option value="5">⭐⭐⭐⭐⭐ (5 Star)</option><option value="4">⭐⭐⭐⭐ (4 Star)</option>
              </select>
              <button type="submit" className="w-full bg-emerald-600 py-2.5 rounded-lg text-xs font-bold text-white uppercase">Publish Live Card</button>
            </form>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {products.map(p => (
                <div key={p.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-3 items-center">
                  <img src={p.image} className="w-12 h-16 object-cover rounded-lg" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-xs text-emerald-400 font-bold mt-0.5">₹{p.price}</p>
                  </div>
                  <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-red-400 hover:bg-slate-700 p-1.5 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🖼️ SECTION: UNLIMITED BANNER MANAGER */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-purple-400" /> Hero Graphic Slider Banners</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={(e) => { e.preventDefault(); setBanners([...banners, { id: Date.now().toString(), ...newBanner }]); }} className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-xs">
              <input type="text" placeholder="Main Heading Banner" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newBanner.title} onChange={(e) => setNewBanner({...newBanner, title: e.target.value})} required />
              <input type="text" placeholder="Sub-text Description" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newBanner.subtitle} onChange={(e) => setNewBanner({...newBanner, subtitle: e.target.value})} required />
              <input type="text" placeholder="Banner Image URL Link" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newBanner.image} onChange={(e) => setNewBanner({...newBanner, image: e.target.value})} required />
              <button type="submit" className="w-full bg-purple-600 py-2 rounded-lg font-bold">Add Banner</button>
            </form>
            <div className="lg:col-span-2 space-y-2">
              {banners.map(b => (
                <div key={b.id} className="flex gap-4 items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <img src={b.image} className="w-20 h-10 object-cover rounded-lg" alt="" />
                  <div className="flex-1"><p className="text-xs font-bold text-white">{b.title}</p></div>
                  <button onClick={() => setBanners(banners.filter(x => x.id !== b.id))} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📄 SECTION: UNLIMITED PAGES BUILDER ENGINE */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><Layout className="text-amber-400 w-4 h-4" /> Custom Page Engine Builder</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={(e) => { e.preventDefault(); setPages([...pages, { id: Date.now().toString(), type: "custom", ...newPage }]); }} className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-xs">
              <input type="text" placeholder="Page Title (e.g. Terms of Use)" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newPage.title} onChange={(e) => setNewPage({...newPage, title: e.target.value})} required />
              <input type="text" placeholder="URL Slug (e.g. terms)" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newPage.slug} onChange={(e) => setNewPage({...newPage, slug: e.target.value})} required />
              <textarea placeholder="Write page inner context information here..." rows={3} className="w-full bg-slate-800 p-2.5 rounded-lg" value={newPage.content} onChange={(e) => setNewPage({...newPage, content: e.target.value})} required />
              <button type="submit" className="w-full bg-amber-600 py-2 rounded-lg font-bold">Instantiate Page</button>
            </form>
            <div className="lg:col-span-2 space-y-2">
              {pages.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 ml-2 py-0.5 rounded bg-slate-700 text-slate-300">{p.type}</span>
                  </div>
                  {p.type === "custom" && (
                    <button onClick={() => setPages(pages.filter(x => x.id !== p.id))} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 💳 SECTION: CUSTOM PAYMENT GATEWAY CONFIG */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-orange-400" /> Dynamic Custom Payment Settings</h2>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                <div>
                  <input type="text" className="bg-transparent font-bold text-white text-sm focus:outline-none border-b border-dashed border-slate-500" value={p.name} onChange={(e) => setPayments(payments.map(x => x.id === p.id ? {...x, name: e.target.value} : x))} />
                  <input type="text" className="block bg-transparent text-xs text-slate-400 mt-1 focus:outline-none border-b border-dashed border-slate-600 w-64" value={p.details} onChange={(e) => setPayments(payments.map(x => x.id === p.id ? {...x, details: e.target.value} : x))} />
                </div>
                <button onClick={() => setPayments(payments.map(x => x.id === p.id ? {...x, active: !x.active} : x))} className={`text-xs px-3 py-1.5 rounded-lg font-bold ${p.active ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>{p.active ? "Gateway Active" : "Disabled"}</button>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ SECTION: CUSTOMER REVIEWS RENDER */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-md font-black text-white mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-blue-400" /> Customer Testimonials & Reviews Grid</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={(e) => { e.preventDefault(); setReviews([...reviews, { id: Date.now().toString(), date: "19 June 2026", ...newRev }]); }} className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-xs">
              <input type="text" placeholder="Client User Name" className="w-full bg-slate-800 p-2.5 rounded-lg" value={newRev.name} onChange={(e) => setNewRev({...newRev, name: e.target.value})} required />
              <textarea placeholder="Feedback message details..." className="w-full bg-slate-800 p-2.5 rounded-lg" value={newRev.text} onChange={(e) => setNewRev({...newRev, text: e.target.value})} required />
              <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">Inject Review</button>
            </form>
            <div className="lg:col-span-2 space-y-2">
              {reviews.map(r => (
                <div key={r.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="text-xs"><p className="font-bold text-white">{r.name}</p><p className="text-slate-400 italic mt-0.5">"{r.text}"</p></div>
                  <button onClick={() => setReviews(reviews.filter(x => x.id !== r.id))} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}