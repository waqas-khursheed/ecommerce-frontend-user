// Mirrors the subset of backed/src/database/models/WebSetting.js fields the
// storefront actually consumes (logo, favicon, contact, social links).
export interface WebSetting {
  id: number;
  main_logo: string | null;
  fav_icon: string | null;
  website_name: string | null;
  website_link: string | null;
  address: string | null;
  email: string | null;
  phone_one: string | null;
  phone_two: string | null;
  copyright: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
}
