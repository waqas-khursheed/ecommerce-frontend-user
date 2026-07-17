import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { brandService } from "@/services/brand.service";
import { tagService } from "@/services/tag.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ products }, categories, brands, tags] = await Promise.all([
    productService.list({ limit: 100, sort: "best_selling" }).catch(() => ({ products: [] })),
    categoryService.list().catch(() => []),
    brandService.list().catch(() => []),
    tagService.list().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brands/${brand.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/tag/${tag.slug}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes, ...tagRoutes];
}
