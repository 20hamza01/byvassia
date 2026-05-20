export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string;
  scentNotes: string;
  priceMAD: number;
  category: string;
  images: string[];
  stock: number;
  status: string;
  featured: boolean;
  weightG: number | null;
  burnTime: string | null;
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceMAD: number;
  image: string;
  qty: number;
  stock: number;
  /** Persisted carts from before bundle pricing existed are missing this — treat absent as "CANDLE". */
  category?: string;
};
