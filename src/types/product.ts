export interface ProductBrand {
  id: number;
  title: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
}

export interface ProductCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parent_id: number;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_desc: string | null;
  children?: ProductCategory[];
}

export interface ProductGalleryImage {
  id: number;
  product_id: number;
  image: string;
}

export interface ProductAttributeAssignment {
  id: number;
  attribute: {
    id: number;
    title: string;
    image: string | null;
    attribute: { id: number; attribute_title: string };
  };
}

export interface ProductTagAssignment {
  id: number;
  tag: { id: number; name: string; slug: string };
}

export interface Stock {
  id: number;
  product_id: number;
  stock_qty: number | null;
  stock_price: number | null;
  stock_dis_price: number;
  stock_dis_percentage: number;
  color_id: number | null;
  size_id: number | null;
  fitting_id: number | null;
}

export interface ReviewStats {
  count: number;
  average: number;
}

// Mirrors backed/src/modules/products/repositories/user.product.repository.js.
// `list` responses only include `brand`; the extra relations below are only
// present on the single-product (detail) response.
export interface Product {
  id: number;
  title: string;
  slug: string;
  short_desc: string | null;
  long_desc: string | null;
  features: string | null;
  inside_box: string | null;

  price: number;
  d_price: number;
  d_percentage: number;

  quantity: number;
  sku: string | null;
  sold: number;

  featured_image: string;
  hovered_image: string | null;
  featured_image_alt: string | null;
  featured_image_title: string | null;

  brand_id: number | null;
  brand?: ProductBrand | null;
  is_variation: 0 | 1;
  is_prescription: 0 | 1;
  weight: number | null;

  new_arrival: 0 | 1;
  best_seller: 0 | 1;

  meta_keywords: string | null;
  meta_description: string | null;

  // Detail-only relations (undefined on list responses).
  productGalleries?: ProductGalleryImage[];
  assignCatToProducts?: { id: number; category_id: number; category: ProductCategory }[];
  assignAttrToProducts?: ProductAttributeAssignment[];
  assignTagToProducts?: ProductTagAssignment[];
  stocks?: Stock[];
  reviewStats?: ReviewStats;
}

// Mirrors backed/src/modules/products/validations/user.product.validation.js
// productListQuerySchema — category/brand/tag are slugs, not ids.
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  tag?: string;
  min_price?: number;
  max_price?: number;
  new_arrival?: 0 | 1;
  best_seller?: 0 | 1;
  sale?: 0 | 1;
  sort?: "newest" | "price_asc" | "price_desc" | "best_selling";
}
