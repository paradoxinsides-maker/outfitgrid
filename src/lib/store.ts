import type { Product, ProductFormData, Category, SiteConfig, CustomerLead } from '../types';

const PRODUCTS_KEY = 'outfitgrid_products';
const CATEGORIES_KEY = 'outfitgrid_categories';
const CONFIG_KEY = 'outfitgrid_config';
const LEADS_KEY = 'outfitgrid_leads';
const ADMIN_KEY = 'outfitgrid_admin_session';
const CUSTOMER_SESSION_KEY = 'outfitgrid_customer_session';

export const ADMIN_EMAIL = 'theoutfitgrid.inquiries@gmail.com';
export const ADMIN_PASSWORD = '8987304834';
export const ADMIN_NAME = 'MAHIRAJ';
export const ADMIN_MOBILE = '8987304834';

const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTRiYTNiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';

export const getDefaultConfig = (): SiteConfig => ({
  brandName: 'OUTFIT GRID',
  logo: '/logo.png',
  bannerImage: '/banner.jpg',
  bannerHeading: 'New Collection Is Here',
  bannerSubheading: 'Trendy outfits up to 50% off. Shop the latest styles now.',
  bannerButtonText: 'Shop Now',
  bannerButtonLink: '#products',
  headerAnnouncement: 'Free shipping on orders above ₹999',
  footerText: 'OUTFIT GRID - Your daily style destination.',
  footerContact: 'Email: theoutfitgrid.inquiries@gmail.com',
  productSheetUrl: '',
});

export const getDefaultCategories = (): Category[] => [
  { id: 'home', name: 'HOME', slug: 'home' },
  { id: 'shop', name: 'SHOP', slug: 'shop' },
  { id: 'men', name: 'MEN', slug: 'men' },
  { id: 'women', name: 'WOMEN', slug: 'women' },
  { id: 'bag', name: 'BAG', slug: 'bag' },
  { id: 'beauty', name: 'BEAUTY', slug: 'beauty' },
  { id: 'makeup', name: 'MAKEUP', slug: 'makeup' },
  { id: 'accessories', name: 'ACCESSORIES', slug: 'accessories' },
  { id: 'footwear', name: 'FOOTWEAR', slug: 'footwear' },
  { id: 'sale', name: 'SALE', slug: 'sale' },
];

const getSampleProducts = (): Product[] => {
  const cats = getDefaultCategories();
  return [
    {
      id: '1',
      title: 'Premium Luxury Printed Casual Shirt',
      tag: 'RARE RABBIT',
      description: 'Soft cotton premium printed shirt perfect for casual outings.',
      price: 2499,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Premium%20Luxury%20Printed%20Casual%20Shirt',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'men')?.id || 'men',
      createdAt: Date.now() - 10000,
    },
    {
      id: '2',
      title: 'Aesthetic Oversized Drop-Shoulder Shirt',
      tag: 'SNITCH',
      description: 'Trendy oversized fit with drop-shoulder design.',
      price: 999,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Aesthetic%20Oversized%20Shirt',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'men')?.id || 'men',
      createdAt: Date.now() - 20000,
    },
    {
      id: '3',
      title: 'Floral Summer Maxi Dress',
      tag: 'ZARA',
      description: 'Lightweight floral maxi dress for summer vibes.',
      price: 1499,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Floral%20Summer%20Maxi%20Dress',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'women')?.id || 'women',
      createdAt: Date.now() - 30000,
    },
    {
      id: '4',
      title: 'Leather Tote Handbag',
      tag: 'H&M',
      description: 'Spacious leather tote bag for daily essentials.',
      price: 1799,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Leather%20Tote%20Handbag',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'bag')?.id || 'bag',
      createdAt: Date.now() - 40000,
    },
    {
      id: '5',
      title: 'Matte Finish Lipstick Set',
      tag: 'NYKAA',
      description: 'Long-lasting matte lipstick set of 5 shades.',
      price: 699,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Matte%20Finish%20Lipstick%20Set',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'makeup')?.id || 'makeup',
      createdAt: Date.now() - 50000,
    },
    {
      id: '6',
      title: 'Running Sneakers',
      tag: 'PUMA',
      description: 'Comfortable running shoes with breathable mesh.',
      price: 2999,
      buyLink: 'https://wa.me/?text=I%20want%20to%20buy%20Running%20Sneakers',
      image: placeholderImage,
      categoryId: cats.find((c) => c.slug === 'footwear')?.id || 'footwear',
      createdAt: Date.now() - 60000,
    },
  ];
};

export const getConfig = (): SiteConfig => {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? { ...getDefaultConfig(), ...JSON.parse(data) } : getDefaultConfig();
  } catch {
    return getDefaultConfig();
  }
};

export const saveConfig = (config: Partial<SiteConfig>) => {
  const current = getConfig();
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...current, ...config }));
};

export const getCategories = (): Category[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : getDefaultCategories();
  } catch {
    return getDefaultCategories();
  }
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const addCategory = (name: string): Category => {
  const categories = getCategories();
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const newCat: Category = { id: crypto.randomUUID(), name: name.trim().toUpperCase(), slug };
  saveCategories([...categories, newCat]);
  return newCat;
};

export const deleteCategory = (id: string) => {
  const categories = getCategories().filter((c) => c.id !== id);
  saveCategories(categories);
  const products = getProducts().filter((p) => p.categoryId !== id);
  saveProducts(products);
};

export const getProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : getSampleProducts();
  } catch {
    return getSampleProducts();
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (formData: ProductFormData): Product => {
  const products = getProducts();
  const newProduct: Product = {
    id: crypto.randomUUID(),
    title: formData.title.trim(),
    tag: formData.tag.trim(),
    description: formData.description.trim(),
    price: Number(formData.price) || 0,
    buyLink: formData.buyLink.trim(),
    image: formData.image.trim() || placeholderImage,
    categoryId: formData.categoryId,
    createdAt: Date.now(),
  };
  saveProducts([newProduct, ...products]);
  return newProduct;
};

export const updateProduct = (id: string, formData: ProductFormData): Product | null => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Product = {
    ...products[index],
    title: formData.title.trim(),
    tag: formData.tag.trim(),
    description: formData.description.trim(),
    price: Number(formData.price) || 0,
    buyLink: formData.buyLink.trim(),
    image: formData.image.trim() || placeholderImage,
    categoryId: formData.categoryId,
  };
  products[index] = updated;
  saveProducts(products);
  return updated;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};

export const searchProducts = (query: string, categoryId?: string): Product[] => {
  const q = query.toLowerCase().trim();
  let list = getProducts();
  if (categoryId && categoryId !== 'all' && categoryId !== 'home' && categoryId !== 'shop') {
    list = list.filter((p) => p.categoryId === categoryId);
  }
  if (!q) return list;
  return list.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};

export const fetchProductsFromSheet = async (sheetUrl: string): Promise<Product[]> => {
  if (!sheetUrl.trim()) return getProducts();

  const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) {
    throw new Error('Invalid Google Sheet URL');
  }
  const sheetId = sheetIdMatch[1];
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  const Papa = await import('papaparse');
  const response = await fetch(csvUrl);
  if (!response.ok) throw new Error('Sheet fetch failed');
  const csvText = await response.text();

  const parsed = Papa.default.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase(),
  });

  const categories = getCategories();
  const rows = parsed.data as Record<string, string>[];

  return rows
    .map((row, index) => {
      const title = row['title'] || row['product title'] || '';
      const tag = row['tag'] || row['brand'] || '';
      const description = row['description'] || '';
      const price = Number(row['price'] || row['mrp']) || 0;
      const buyLink = row['buylink'] || row['buy link'] || row['link'] || '#';
      const image = row['image'] || row['image url'] || row['imageurl'] || placeholderImage;
      const categoryName = (row['category'] || '').trim().toUpperCase();
      const category = categories.find(
        (c) => c.name === categoryName || c.slug === categoryName.toLowerCase()
      );

      if (!title) return null;

      return {
        id: row['id'] || `sheet-${index}`,
        title: title.trim(),
        tag: tag.trim(),
        description: description.trim(),
        price,
        buyLink: buyLink.trim(),
        image: image.trim(),
        categoryId: category?.id || categories[0]?.id || 'shop',
        createdAt: Date.now() - index * 1000,
      } as Product;
    })
    .filter((p): p is Product => p !== null);
};

export const getProductSheetTemplateCsv = () => {
  return `ID,Title,Tag,Description,Price,BuyLink,Image,Category
1,Premium Luxury Printed Casual Shirt,RARE RABBIT,Soft cotton premium printed shirt perfect for casual outings,2499,https://wa.me/?text=I%20want%20to%20buy%20Premium%20Shirt,https://example.com/shirt.jpg,MEN
2,Floral Summer Maxi Dress,ZARA,Lightweight floral maxi dress for summer vibes,1499,https://wa.me/?text=I%20want%20to%20buy%20Dress,https://example.com/dress.jpg,WOMEN
3,Leather Tote Handbag,H&M,Spacious leather tote bag for daily essentials,1799,https://wa.me/?text=I%20want%20to%20buy%20Bag,https://example.com/bag.jpg,BAG`;
};

export const getCustomerLeads = (): CustomerLead[] => {
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCustomerLeads = (leads: CustomerLead[]) => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

export const registerCustomer = (lead: Omit<CustomerLead, 'id' | 'createdAt'>) => {
  const leads = getCustomerLeads();
  if (leads.some((l) => l.mobile === lead.mobile || l.email === lead.email)) {
    return { success: false, message: 'Is mobile/email se pehle se account hai. Login karein.' };
  }
  const newLead: CustomerLead = { ...lead, id: crypto.randomUUID(), createdAt: Date.now() };
  saveCustomerLeads([newLead, ...leads]);
  setLoggedInCustomer(newLead);
  return { success: true, lead: newLead };
};

export const loginCustomer = (mobile: string, password: string) => {
  const leads = getCustomerLeads();
  const lead = leads.find((l) => l.mobile === mobile && l.password === password);
  if (!lead) return { success: false, message: 'Galat mobile number ya password.' };
  setLoggedInCustomer(lead);
  return { success: true, lead };
};

export const setLoggedInCustomer = (lead: CustomerLead | null) => {
  if (lead) {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(lead));
  } else {
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
  }
};

export const getLoggedInCustomer = (): CustomerLead | null => {
  try {
    const data = localStorage.getItem(CUSTOMER_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const deleteCustomerLead = (id: string) => {
  saveCustomerLeads(getCustomerLeads().filter((l) => l.id !== id));
};

export const isAdminLoggedIn = (): boolean => {
  return localStorage.getItem(ADMIN_KEY) === 'true';
};

export const loginAdmin = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_KEY);
};

export const logoutCustomer = () => {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
};

export const compressImage = (file: File, maxWidth = 900, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context nahi mila'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

export const exportAllToExcel = async () => {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const products = getProducts().map((p) => ({
    ID: p.id,
    Title: p.title,
    Tag: p.tag,
    Description: p.description,
    Price: p.price,
    BuyLink: p.buyLink,
    Image: p.image,
    CategoryID: p.categoryId,
    Category: getCategories().find((c) => c.id === p.categoryId)?.name || '',
    CreatedAt: new Date(p.createdAt).toLocaleString('en-IN'),
  }));
  const wsProducts = XLSX.utils.json_to_sheet(products);
  XLSX.utils.book_append_sheet(wb, wsProducts, 'Products');

  const categories = getCategories().map((c) => ({ ID: c.id, Name: c.name, Slug: c.slug }));
  const wsCategories = XLSX.utils.json_to_sheet(categories);
  XLSX.utils.book_append_sheet(wb, wsCategories, 'Categories');

  const leads = getCustomerLeads().map((l) => ({
    ID: l.id,
    Name: l.name,
    Mobile: l.mobile,
    Email: l.email,
    CreatedAt: new Date(l.createdAt).toLocaleString('en-IN'),
  }));
  const wsLeads = XLSX.utils.json_to_sheet(leads);
  XLSX.utils.book_append_sheet(wb, wsLeads, 'CustomerLeads');

  const cfg = getConfig();
  const settings = [
    { Key: 'brandName', Value: cfg.brandName },
    { Key: 'logo', Value: cfg.logo },
    { Key: 'bannerImage', Value: cfg.bannerImage },
    { Key: 'bannerHeading', Value: cfg.bannerHeading },
    { Key: 'bannerSubheading', Value: cfg.bannerSubheading },
    { Key: 'bannerButtonText', Value: cfg.bannerButtonText },
    { Key: 'bannerButtonLink', Value: cfg.bannerButtonLink },
    { Key: 'headerAnnouncement', Value: cfg.headerAnnouncement },
    { Key: 'footerText', Value: cfg.footerText },
    { Key: 'footerContact', Value: cfg.footerContact },
    { Key: 'productSheetUrl', Value: cfg.productSheetUrl },
  ];
  const wsSettings = XLSX.utils.json_to_sheet(settings);
  XLSX.utils.book_append_sheet(wb, wsSettings, 'SiteSettings');

  XLSX.writeFile(wb, `outfit-grid-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
};
