export interface ProductCategory {
  id: number;
  title: string;
  slug: string;
}

export interface ProductBrand {
  id: number;
  title: string;
  slug: string;
  logo: string | null;
}

export interface ProductGalleryImage {
  id: number;
  image: string;
}

// TODO: confirm final shape against backed/src/modules/products (user-facing
// product list/detail endpoints) once integration starts.
export interface Product {
  id: number;
  title: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;

  price: number;
  d_price: number;
  d_percentage: number;

  quantity: number;
  sku: string | null;

  featured_image: string;
  hovered_image: string | null;

  brand: ProductBrand | null;
  categories: ProductCategory[];
  gallery: ProductGalleryImage[];

  new_arrival: 0 | 1;
  best_seller: 0 | 1;
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "best_selling";
}
