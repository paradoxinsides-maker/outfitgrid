export interface Product {
  id: string;
  title: string;
  tag: string;
  description: string;
  price: number;
  buyLink: string;
  image: string;
  categoryId: string;
  createdAt: number;
}

export interface ProductFormData {
  title: string;
  tag: string;
  description: string;
  price: string;
  buyLink: string;
  image: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SiteConfig {
  brandName: string;
  logo: string;
  bannerImage: string;
  bannerHeading: string;
  bannerSubheading: string;
  bannerButtonText: string;
  bannerButtonLink: string;
  headerAnnouncement: string;
  footerText: string;
  footerContact: string;
  productSheetUrl: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  createdAt: number;
}

export type AdminTab = 'products' | 'categories' | 'settings' | 'leads';
