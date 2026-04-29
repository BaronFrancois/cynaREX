import { Product } from "./produit";

export interface CartItem extends Product {
  quantity: number;
}

export interface CartProps {
  items: CartItem[];
  removeFromCart: (id: string) => void;
}