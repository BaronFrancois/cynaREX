export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  period: 'monthly' | 'yearly';
  category: 'EDR' | 'XDR' | 'SOC';
  features: string[];
  status: 'available' | 'maintenance' | 'coming_soon';
  image: string;
}