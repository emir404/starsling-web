import type { Metadata } from "next";

import { Cta, Faq, Pricing } from "@/components/sections";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, usage-based pricing. Start free and pay only for what you build.",
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
