import { useState, useEffect } from 'react';
import { Upload, X, Link2, Tag, FileText, DollarSign, Type, ImageIcon, ListFilter } from 'lucide-react';
import { compressImage } from '../lib/store';
import type { Product, ProductFormData, Category } from '../types';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (formData: ProductFormData) => void;
  onCancel: () => void;
}

const initialForm: ProductFormData = {
  title: '',
  tag: '',
  description: '',
  price: '',
  buyLink: '',
  image: '',
  categoryId: '',
};

export default function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        tag: product.tag,
        description: product.description,
        price: String(product.price),
        buyLink: product.buyLink,
        image: product.image,
        categoryId: product.categoryId,
      });
    } else {
      setForm({
        ...initialForm,
        categoryId: categories[0]?.id || '',
      });
    }
  }, [product, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Sirf image file upload karein.');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 900, 0.75);
      setForm((prev) => ({ ...prev, image: compressed }));
    } catch (err) {
      alert('Image compress karne mein error aaya. Dobara try karein.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim() || !form.buyLink.trim() || !form.categoryId) {
      alert('Title, price, buy link aur category required hain.');
      return;
    }
    onSave(form);
    if (!product) setForm({ ...initialForm, categoryId: categories[0]?.id || '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <Upload size={20} className="text-indigo-600" />
          {product ? 'Product Edit Karein' : 'Naya Product Upload Karein'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <ListFilter size={14} /> Category
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            required
          >
            <option value="">Category select karein</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Type size={14} /> Product Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Premium Casual Shirt"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Tag size={14} /> Brand / Tag
          </label>
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="e.g. RARE RABBIT"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <FileText size={14} /> Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Product ki details yahan likhein..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <DollarSign size={14} /> Price (₹)
          </label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 999"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <Link2 size={14} /> Buy Now Link
          </label>
          <input
            name="buyLink"
            type="url"
            value={form.buyLink}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
            <ImageIcon size={14} /> Product Image
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {form.image && (
              <div className="shrink-0">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100"
              />
              {uploading && (
                <p className="text-[11px] text-indigo-600 font-medium">Image compress ho rahi hai...</p>
              )}
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Ya image URL paste karein"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
