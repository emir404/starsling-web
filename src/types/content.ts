import type { LucideIcon } from "lucide-react";

/** A single navigation or footer link. */
export type NavLink = {
  label: string;
  href: string;
};

/** A titled group of links in the footer. */
export type FooterColumn = {
  title: string;
  links: NavLink[];
};

/** A product feature card. */
export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** A headline metric (e.g. "80% faster builds"). */
export type Stat = {
  value: string;
  label: string;
};

/** A pricing plan. */
export type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

/** A single FAQ question/answer pair. */
export type FaqItem = {
  question: string;
  answer: string;
};

/** A customer testimonial. */
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

/** A customer logo (text wordmark for now; `src` once assets land in /public/logos). */
export type CustomerLogo = {
  name: string;
  src?: string;
};
