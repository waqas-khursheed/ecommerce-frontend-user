import type { Product, ProductBrand, ProductCategory } from "@/types/product";

export interface Slide {
  id: number;
  image: string;
  Heading: string | null;
  bullet_1: string | null;
  bullet_2: string | null;
  bullet_3: string | null;
  link: string | null;
  status: 0 | 1;
}

export interface BannerImage {
  id: number;
  image: string;
  status: 0 | 1;
}

export interface SideBannerImage extends BannerImage {
  type: string;
}

// Mirrors backed/src/modules/home/controllers/home.controller.js getHomeContent.
export interface HomeContent {
  slides: Slide[];
  homeBanners: BannerImage[];
  sideBanners: SideBannerImage[];
  applicationSlides: Slide[];
  applicationHomeBanners: BannerImage[];
  mobileSliders: BannerImage[];
  newArrivals: Product[];
  bestSellers: Product[];
  onSale: Product[];
  categories: ProductCategory[];
  brands: ProductBrand[];
}
