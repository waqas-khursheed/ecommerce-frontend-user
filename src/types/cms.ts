export interface Faq {
  id: number;
  question: string;
  answer: string;
  slug: string;
  category_id: number;
}

export interface FaqCategory {
  id: number;
  title: string;
  faqs: Faq[];
}

export interface CommonPage {
  id: number;
  title: string;
  slug: string;
  heading: string | null;
  content: string;
  image: string | null;
  page_name: string;
}

export interface ContactUsPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  map: string | null;
}
