import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Pencil, Trash2, Package, Search, LayoutGrid, Settings, Users, Tag, ImageIcon, Type, Link2, FileText, Mail, Phone, Download, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import ProductForm from '../components/ProductForm';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  deleteCategory,
  getConfig,
  saveConfig,
  isAdminLoggedIn,
  logoutAdmin,
  getCustomerLeads,
  deleteCustomerLead,
  exportAllToExcel,
  ADMIN_NAME,
  compressImage,
  getProductSheetTemplateCsv,
} from '../lib/store';
import type { Product, ProductFormData, Category, SiteConfig, CustomerLead, AdminTab } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<SiteConfig>(getConfig());
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [newCategory, setNewCategory] = useState('');
  const [settingsForm, setSettingsForm] = useState<SiteConfig>(config);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setProducts(getProducts());
    setCategories(getCategories());
    setConfig(getConfig());
    setSettingsForm(getConfig());
    setLeads(getCustomerLeads());
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    refreshData();
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id: string) => {
    if (deleteId === id) {
      deleteProduct(id);
      refreshData();
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setTimeout(() => setDeleteId((current) => (current === id ? null : current)), 3000);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory.trim());
    setNewCategory('');
    refreshData();
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    refreshData();
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    setUploading: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file upload karein.');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 900, 0.8);
      setter(compressed);
    } catch {
      alert('Image compress karne mein error aayi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = () => {
    const update: Partial<SiteConfig> = { ...settingsForm };
    if (logoFile) update.logo = logoFile;
    if (bannerFile) update.bannerImage = bannerFile;
    saveConfig(update);
    refreshData();
    alert('Site settings save ho gayi!');
  };

  const downloadSheetTemplate = () => {
    const csv = getProductSheetTemplateCsv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outfit-grid-product-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteLead = (id: string) => {
    deleteCustomerLead(id);
    refreshData();
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const formatDate = (ts: number) => new Date(ts).toLocaleString('en-IN');

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'products', label: 'Products', icon: <Package size={16} /> },
    { id: 'categories', label: 'Categories', icon: <Tag size={16} /> },
    { id: 'settings', label: 'Site Settings', icon: <Settings size={16} /> },
    { id: 'leads', label: 'Customers', icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        config={config}
        showSearch={false}
        onLogout={handleLogout}
      />

      <main className="max-w-5xl mx-auto px-4 py-5 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid size={24} className="text-indigo-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, {ADMIN_NAME} — saari website yahan se manage karein</p>
          </div>
          <button
            onClick={exportAllToExcel}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
          >
            <Download size={16} />
            Export Excel
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-5 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div className="space-y-5">
            {showForm && (
              <ProductForm
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              />
            )}

            {!showForm && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowForm(true);
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Naya Product Add Karein
              </button>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Admin me product search karein..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase mb-1">
                          {categories.find((c) => c.id === product.categoryId)?.name || 'General'}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{product.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>
                        <p className="text-sm font-bold text-rose-600 mt-1">{formatPrice(product.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              deleteId === product.id
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            <Trash2 size={13} />
                            {deleteId === product.id ? 'Confirm?' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-sm text-slate-500">
                {searchQuery ? 'Koi product nahi mila' : 'Abhi koi product nahi hai. Add karein!'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Tag size={18} className="text-indigo-600" /> Categories Manage Karein
            </h2>
            <div className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nayi category ka naam"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Settings size={18} className="text-indigo-600" /> Site Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Type size={13}/> Brand Name</label>
                <input name="brandName" value={settingsForm.brandName} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Type size={13}/> Header Announcement</label>
                <input name="headerAnnouncement" value={settingsForm.headerAnnouncement} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><ImageIcon size={13}/> Logo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={logoFile || settingsForm.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setLogoFile, setUploadingLogo)}
                      className="text-xs"
                    />
                    {uploadingLogo && <p className="text-[11px] text-indigo-600 mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><ImageIcon size={13}/> Banner Image</label>
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <img src={bannerFile || settingsForm.bannerImage} alt="Banner" className="w-full sm:w-40 h-24 object-cover rounded-xl border border-slate-200" />
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setBannerFile, setUploadingBanner)}
                      className="text-xs"
                    />
                    {uploadingBanner && <p className="text-[11px] text-indigo-600 mt-1">Uploading...</p>}
                  </div>
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Type size={13}/> Banner Heading</label>
                <input name="bannerHeading" value={settingsForm.bannerHeading} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><FileText size={13}/> Banner Subheading</label>
                <input name="bannerSubheading" value={settingsForm.bannerSubheading} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Type size={13}/> Banner Button Text</label>
                <input name="bannerButtonText" value={settingsForm.bannerButtonText} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Link2 size={13}/> Banner Button Link</label>
                <input name="bannerButtonLink" value={settingsForm.bannerButtonLink} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><FileText size={13}/> Footer Text</label>
                <input name="footerText" value={settingsForm.footerText} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5"><Mail size={13}/> Footer Contact</label>
                <input name="footerContact" value={settingsForm.footerContact} onChange={handleSettingsChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="space-y-1 sm:col-span-2 border-t border-slate-100 pt-4 mt-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <FileSpreadsheet size={13}/> Google Sheet URL (Product Database)
                </label>
                <input
                  name="productSheetUrl"
                  value={settingsForm.productSheetUrl}
                  onChange={handleSettingsChange}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500">
                  Google Sheet link paste karo. Sheet publicly viewable honi chahiye. Website isse products automatically fetch karegi.
                </p>
                <button
                  type="button"
                  onClick={downloadSheetTemplate}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100"
                >
                  <Download size={13}/>
                  Product Template CSV Download
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Save Settings
            </button>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users size={18} className="text-indigo-600" /> Customer Leads
              </h2>
              {leads.length === 0 ? (
                <p className="text-sm text-slate-500">Abhi koi customer signup nahi hua.</p>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{lead.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone size={11}/> {lead.mobile}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={11}/> {lead.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatDate(lead.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
