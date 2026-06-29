import type { Metadata } from "next";

import {
  Bottleneck,
  Cta,
  Faq,
  Hero,
  HowItWorks,
  MergedPrs,
  Pricing,
  Prs,
  SocialProof,
  Testimonials,
  Video,
} from "@/components/sections";

export const metadata: Metadata = {
  // Home is the canonical root; sub-pages set their own canonical as needed.
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Testimonials />
      <Bottleneck />
      <MergedPrs />
      <Prs />
      <Pricing />
      <Faq />
      <Video />
      <Cta />
    </>
  );
}
