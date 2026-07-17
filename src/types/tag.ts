// Mirrors backed/src/database/models/ProductTag.js — exposed read-only via
// backed/src/modules/tags/controllers/user.tag.controller.js. No `status`
// column on this model, unlike Brand/ProductCategory — every tag is public.
export interface ProductTag {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  og_image: string | null;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  body_description: string | null;
}
